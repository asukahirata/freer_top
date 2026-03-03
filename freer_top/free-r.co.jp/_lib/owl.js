if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
	Element.prototype.closest = function(value) {
	var element = this;
	do {
		if (element.matches(value)) return element;
		element = element.parentelementement || element.parentNode;
	} while (element !== null && element.nodeType === 1);
		return null;
	};
}

function owl_lang_dir(){
	r=window.location.href.match(/\/\.(.*?)\//);
	if(r===null){
		return '';
	}
	return '/.'+r[1];
}


function richtext_editor(elm){
	/*
	var editor = new Jodit(elm,{
		"allowResizeX": true
		,"height": 420
		,"uploader": {
			"insertImageAsBase64URI": true
		}
		,"toolbarAdaptive": false
		,"enter": "BR"
		,controls: {
							paragraph: {
								exec: function (editor, event, control) {
									editor.selection.insertHTML(control.name=='p'
										?'<' + control.name +' style="font:initial;">'+editor.selection.getHTML()+'</'+control.name+'>'
										:'<' + control.name +'>'+editor.selection.getHTML()+'</'+control.name+'>'
									);
								}
					        }
					    }
	});
	*/
	var ua = navigator.userAgent.toLowerCase();
	var isiPhone = (ua.indexOf('iphone') > -1);
	var isiPad = (ua.indexOf('ipad') > -1);
	var isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
	var isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') == -1);
	var is_mobile=isiPhone|isiPad |isAndroid|isAndroidTablet;
	var editors=[];
	if(elm.style.display!='none'){
		if(is_mobile){
			var editor = new Jodit(e,{
				"uploader": {
					"insertImageAsBase64URI": true
				}
				,"preset":"inline"
				,"toolbarButtonSize": "small"
				,"popup": {
					selection: ['source','bold','strikethrough','underline','italic','eraser',"\n",'superscript','subscript','ul','ol','outdent','indent',"\n"
					,'font','fontsize','brush','paragraph','file','video','table',"\n",'link','align','undo','redo','selectall','cut','copy',"\n",'paste','copyformat','hr','symbol','fullsize','print','about']
				}
				,useSearch:false
				,"enter": "BR"
				,"showCharsCounter": false
				,"showWordsCounter": false
				,"showXPathInStatusbar": false
			});
			editors.push(editor);
			
			editor.container.setAttribute('data-id',editors.length-1);
			editor.container.style.userSelect='all';
			editor.container.style.setProperty('-webkit-user-select','auto');
			editor.container.querySelector('.jodit_wysiwyg').addEventListener('keyup',function(event){
				if(event.key=="Enter"){
					if(isiPhone||isiPad){
						document.querySelector('main').scrollTop = document.querySelector('main').scrollTop
							+25
						;
					}else{
						document.querySelector('main').scrollTop = document.querySelector('main').scrollTop
							+window.getSelection().baseNode.querySelector('br').getBoundingClientRect().height
						;
					}
				}
			});
		}else{
			var editor = new Jodit(elm,{
				"allowResizeX": true
				,"uploader": {
					"insertImageAsBase64URI": true
				}
				,"buttons": ['source','imageList','|','bold','strikethrough','underline','italic','eraser','|','superscript','subscript','|','ul','ol','|','outdent','indent','|'
					,'font','fontsize','brush','paragraph','|','file','video','table','link','|','align','undo','redo','selectall','cut','copy','paste','copyformat','|','hr','symbol','fullsize','print','about']
				,"controls":{
					"imageList":{
						"name":'imageList'
						,"icon":'image'
						,"exec":function(editor){
							var subw = 830;
							var subh = 650;
							var subp = "/jodit_image/jodit_images.html?id="+editor.id;
							var subn = "images";
							var subx = ( screen.availWidth  - subw ) / 2;
							var suby = ( screen.availHeight - subh ) / 2;
							var SubWinOpt = "width=" + subw + ",height=" + subh + ",top=" + suby + ",left=" + subx;
							win = window.open(subp, subn, SubWinOpt);
							function receiveMessage(event)
							{
								if(event.data.id!=undefined){
									if(event.data.id==editor.id){
										editor.selection.insertImage(event.data.img, null, null);
									}
								}else{
									editor.selection.insertImage(event.data, null, null);
								}
								win.close();
								window.removeEventListener("message", receiveMessage, true); 
							}
							window.addEventListener("message", receiveMessage, true);
					}}
				}
				,"toolbarAdaptive": false
				,"showWordsCounter": false
				,"enter": "BR"
			});
		}
	}
	elm.addEventListener('change',function(event){
		let ea=event.target.previousElementSibling.querySelector('.jodit-workplace > .jodit-wysiwyg');
		if(ea){
			ea.querySelectorAll('table').forEach(function(e){
				e.classList.add('-x-on-richtext');
			});
			editor.value=ea.innerHTML;
		}
	});
}
document.addEventListener("DOMContentLoaded", function(domloaded){
	var b=document.querySelector('body');
	Array.prototype.slice.call(document.querySelectorAll('textarea.richtext'),0).forEach(function(e){
		richtext_editor(e);
	});
	b.addEventListener('keydown',function(event){
		var e=event.target.closest('.jodit_wysiwyg');
		if(e){
			return true;
		}
	});
	calender4ie11(document);
});

function calender4ie11(doc)
{
	var obj = document.createElement("input");
	obj.setAttribute("type", "date");
	if(obj.type != "date"){
		var i=0;
		Array.prototype.slice.call(doc.querySelectorAll('input[type="date"]'),0).forEach(function(e){
			d=document.createElement('div');
			d.setAttribute('class','input_calendar');
			d.setAttribute('style','display: none;');
			d.setAttribute('id','c'+(++i));
			e.parentNode.insertBefore(d,e.nextSibling);
			e.setAttribute('data-cid','c'+i);
			e.addEventListener('focusin',function(event){
				Array.prototype.slice.call(document.querySelectorAll('.input_calendar'),0).forEach(function(cl){
					cl.style.display='none';
				});
				
				var dt=new Date(Date.now());
				CalendarInput(event.target.getAttribute('data-cid'),dt.getFullYear(), dt.getMonth()+1, dt.getDate())
				e.style.display='none';
			});
		});
	}
}

/*************************************************************
 *  Calendar 独自関数作成
 ************************************************************/
var CalendarId    = null;
var CalendarYear  = null;
var CalendarMonth = null;
var CalendarDay   = null;

var CalendarSelectYear  = null;
var CalendarSelectMonth = null;
var CalendarSelectDay   = null;

var CalendarStartWeek = null;
var CalendarEndDay = null;

var CalendarClass = function() {
	this.now='';
	this.prex_onclick='';
	this.next_onclick='';
	this.cols='';
	this.rows='';
	this.calendar=new Array();
};
var CalendarObject = null;

var CalendarWeek=new Array();
CalendarWeek[0]="日";
CalendarWeek[1]="月";
CalendarWeek[2]="火";
CalendarWeek[3]="水";
CalendarWeek[4]="木";
CalendarWeek[5]="金";
CalendarWeek[6]="土";

function Calendar(id, year, month, day) {
	SetParameter(id, year, month, day);
	CalendarObject = new CalendarClass();
	DayCalendar();
	ClearRender();
	CalendarRender();
}

function CalendarInput(id, year, month, day) {
	if (CalendarId != null && CalendarId != id) CalendarClose(CalendarId);
	Calendar(id, year, month, day);
	document.getElementById(id).style.display="block";
}

function CalendarClose(id) {
	document.getElementById(id).style.display="none";
	document.getElementById(id).previousSibling.style.display='';
}

function CalendarInputSet(year, month, day) {
	document.getElementById(CalendarId).previousSibling.value=year + '-' + ('0' + month).slice(-2)+ '-' + ('0' + day).slice(-2);
	CalendarClose(CalendarId);
}

function ClearRender() {
	document.getElementById(CalendarId).innerHTML='';
}

function SetParameter(id, year, month, day) {
	CalendarId = id;
	if (year == "") {
		var date = new Date();
		year = date.getFullYear();
		month = date.getMonth()+1;
		day = date.getDate();
		CalendarYear = parseInt(year, 10);
		CalendarMonth = parseInt(month, 10);
		CalendarDay = parseInt(day, 10);
		CalendarSelectYear = parseInt(year, 10);
		CalendarSelectMonth = parseInt(month, 10);
		CalendarSelectDay = parseInt(day, 10);
	} else {
		CalendarYear = parseInt(year, 10);
		CalendarMonth = parseInt(month, 10);
		if (day != "undefined" && day != '') {
			CalendarDay = parseInt(day, 10);
		} else {
			CalendarDay = 1;
		}
	}
	
	if (CalendarSelectYear == null) {
		CalendarSelectYear = parseInt(year, 10);
		CalendarSelectMonth = parseInt(month, 10);
		if (day != "undefined" && day != '') {
			CalendarSelectDay = parseInt(day, 10);
		} else {
			CalendarSelectDay = 1;
		}
	}
}

function DayCalendar() {
	CalendarObject.now=CalendarYear + '年' + CalendarMonth + '月';
	CalendarObject.prev_onclick=CreateOnclick('day', 'prev');
	CalendarObject.next_onclick=CreateOnclick('day', 'next');
	CalendarObject.cols='7';
	CalendarObject.rows='*';
	CalendarObject.calendar=CreateCalendar();
}

function CreateOnclick(date) {
	var prev_year  = null;
	var prev_month = null;
	var next_year  = null;
	var next_month = null;

	var target_month = null;
	if (CalendarMonth == '1') {
		prev_year = CalendarYear-1;
		prev_month = 12;
		next_year = CalendarYear;
		next_month = CalendarMonth+1;
	} else if (CalendarMonth == '12') {
		prev_year = CalendarYear;
		prev_month = CalendarMonth-1;
		next_year = CalendarYear+1;
		next_month = 1;
	} else {
		prev_year = CalendarYear;
		prev_month = CalendarMonth-1;
		next_year = CalendarYear;
		next_month = CalendarMonth+1;
	}
	if (date == 'prev') {
		target_year = prev_year;
		target_month = prev_month;
	} else {
		target_year = next_year;
		target_month = next_month;
	}
	return "Calendar('"+CalendarId+"','"+target_year+"','"+target_month+"','"+CalendarDay+"')";
}

function CreateCalendar() {
	var calendar = new Array();
	var value = 1;
	
	var rows = CalendarRows();
	var start_flag = false;
	var end_flag = false;
	for (var i=0; i<rows; i++) {
		calendar[i] = new Array();
		for (var j=0; j<CalendarObject.cols; j++) {
			if (!start_flag && j==CalendarStartWeek) {
				start_flag = true;
			}
			if (start_flag && !end_flag) {
				calendar[i][j]=value;
				value++;
			} else {
				calendar[i][j]=null;
			}
			if (!end_flag && value > CalendarEndDay) {
				end_flag = true;
			}
		}
	}
	
	return calendar;
}

function CalendarRows() {
	var year = CalendarYear;
	var month = CalendarMonth-1;
	var day = 1;

	var date = new Date(year, month, day);
	CalendarStartWeek = date.getDay();
	
	var date_object = new Date(
		date.getYear(),
		date.getMonth(),
		date.getDate()
	);
	date_object.setMonth(date_object.getMonth() + 1);
	date_object.setDate(1);
	date_object.setTime(date_object.getTime() - 1);
	CalendarEndDay = date_object.getDate();
	
	var cols_all = CalendarStartWeek + CalendarEndDay;
	return cols_all/7;
}

function CalendarRender() {
	var element = document.createElement("table");
	element.cellSpacing=0;
	element.style.display='table';
	
	CalendarSetClass(element, 'input_calendar');
	
	// ie6,7 bug fixed
	var tbody_element = document.createElement("tbody");
	tbody_element.style.display='table-row-group';
	
	var tr_element = null;
	var th_element = null;
	var td_element = null;
	
	var page_jump = "#content_top";
	
	// Header デザインをここに移動
	
	tr_element = document.createElement("tr");
	tr_element.style.display='table-row';
	th_element = document.createElement("th");
	th_element.style.display='table-cell';
	th_element.style.textAlign='center';
	
	th_element.colSpan="7";
	var div_element = document.createElement("div");
	CalendarSetClass(th_element,"report_daily");
	div_element.innerHTML="<button onclick=\"" + CalendarObject.prev_onclick + "\">&lt;</button>" +
    	                  "<span class=\"report_bold\"> " + CalendarObject.now + " </span>" +
        	              "<button onclick=\"" + CalendarObject.next_onclick + "\">&gt;</button>";
    th_element.appendChild(div_element);
    tr_element.appendChild(th_element);
	tbody_element.appendChild(tr_element);
	
	for (var i=0; i<CalendarObject.calendar.length; i++) {
		
		if (i == 0) {
			tr_element = document.createElement("tr");
			tr_element.style.display='table-row';
			for (var j=0; j<CalendarObject.cols; j++) {
				th_element = document.createElement("th");
				th_element.style.display='table-cell';
				th_element.style.width='auto';
				
				if (j == 0) {
					CalendarSetClass(th_element, 'holiday_font_color');
				}
				if (j == 6) {
					CalendarSetClass(th_element, 'saturday_font_color');
				}
				th_element.innerHTML=CalendarWeek[j];
				tr_element.appendChild(th_element);
			}
			tbody_element.appendChild(tr_element);
		}
		
		tr_element = document.createElement("tr");
		tr_element.style.display='table-row';
		for (var j=0; j<CalendarObject.cols; j++) {
			var value = CalendarObject.calendar[i][j];
			td_element = document.createElement("td");
			td_element.style.display='table-cell';
			td_element.style.width='auto';
			var selection = CalendarSelection(value);
			
			if (value == "" || value == null) {
				td_element.innerHTML="&nbsp;";
			} else {
				if (selection) {
					CalendarSetClass(td_element,"today-1 report_bold");
				}
				td_element.innerHTML="<a style=\"cursor:pointer;\" onclick=\"CalendarInputSet('" + CalendarYear + "', '" + CalendarMonth + "', '" + value + "');\">" + value + "</a>";
			}
			tr_element.appendChild(td_element);
		}
		tbody_element.appendChild(tr_element);
	}
	
	element.appendChild(tbody_element);
	document.getElementById(CalendarId).appendChild(element);
}

function HeaderRender() {
	var element = document.createElement("div");
	CalendarSetClass(element,"report_daily");
	element.innerHTML="<button onclick=\"" + CalendarObject.prev_onclick + "\">&lt;</button>" +
	                  "<span class=\"report_bold\">" + CalendarObject.now + "</span>" +
	                  "<button onclick=\"" + CalendarObject.next_onclick + "\">&gt;</button>";
	document.getElementById(CalendarId).appendChild(element);
}


function CalendarSetClass(element, className) {
	element.setAttribute("class", className);
}

function CalendarSelection(value) {
	if (value == null) return false;
	if (CalendarYear == CalendarSelectYear && CalendarMonth == CalendarSelectMonth && value == CalendarSelectDay) return true;
	return false;
}
