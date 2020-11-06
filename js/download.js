function downloadFunc(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//download("hello.txt","This is the content of my file");



//The whole calendar file is grouped by three Strings(Header, Event information, and Tail)
//Here is the header
function calHeaderFunc() {
  var calHead = 'BEGIN:VCALENDAR\r\n' + 'PRODID:-//JCU//Outlook 10.0 MIMEDIR//EN\r\n' +
    'VERSION:2.0\r\n' + 'METHOD:PUBLISH\r\n';
  return calHead;
}

//Here is the tail
function calTailFunc() {
  var calTail = 'END:VCALENDAR\r\n';
  return calTail;
}

//Here is the event(s)
function calEventFunc(startT, stopT, summa, desc) {

  var vEventHead = 'BEGIN:VEVENT\r\n' + 'TRANSP:OPAQUE\r\n' + 'UID:' + uuid() + '\r\n' + 'SUMMARY:' + summa + '\r\n' +
    'DESCRIPTION:' + desc + '\r\n';
  ;
  var vEventMiddle = 'PRIORITY:5\r\n' + 'DTSTART;TZID=Asia/Shanghai:' + startT + '\r\n' +
    'DTEND;TZID=Asia/Shanghai:' + stopT + '\r\n';

  var vEventTail = 'SEQUENCE:1\r\n' + 'URL;VALUE=URI:\r\n' + 'BEGIN:VALARM\r\n' + 'TRIGGER:-PT15M\r\n' + 'ACTION:DISPLAY\r\n' + 'DESCRIPTION:Reminder\r\n' +
    'END:VALARM\r\n' + 'END:VEVENT\r\n';
  var result = vEventHead + vEventMiddle + vEventTail;
  //DTSTART;TZID=Asia/Shanghai:20201020T120000
  //DTEND;TZID=Asia/Shanghai:20201020T130000

  return result;

};

//Convert the months to number
function monthToNumber(mon) {
  //Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
  var dict = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', 'Jun': 06, 'Jul': '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  return dict[mon];


}


//Function of processing the texts.
function subTextHelper(vClassCode,vDate,vDay,vTime,vHall) {
  //   Original infor from the website
  //   <tr>
  //   <td>CP5631-LA</td>
  //   <td>Nov 09, 20</td>
  //   <td>Mon</td>
  //   <td>09:00-11:50</td>
  //   <td>Online Class</td>
  //   </tr>

  //Here is the subject code 
  var subName = vClassCode;

  //console.log('The subject code is:' + subName);

  //Need YYMM
  //console.log(vDate + "is vDate:" + typeof(vDate));

  var tempMonthStr = vDate.toString().substring(0,3);
  var monthStr= monthToNumber(tempMonthStr);
  //console.log('month is:' + monthStr);

  //Need DD
  var dateStr = vDate.substring(vDate.indexOf(',') - 2, vDate.indexOf(','))
  //console.log("date DD is :" + dateStr)


  //Need 20YYT
  var yearStr = vDate.substring(vDate.length-2);
  //console.log("year is :" + yearStr);

  var yearStr= '20' + yearStr;
  //console.log('date20XX is:' + yearStr); 

  //Subject Date linked together
  var subDate = yearStr + monthStr + dateStr;
  //console.log("subject Date is " + subDate);

  //Changed By Dezhi -- 2020-11-03
  var startHour = vTime.substring(0,5).replace(':','');
  //'13:00'.replace(':', '');
  //console.log("Start Hour is :" + startHour);

  var stopHour = vTime.substring(vTime.length-5).replace(':', '');
  //console.log("Stop hour is :" + stopHour);

  //Group cal time values together, into an Array
  var calVaues = new Array(subDate + "T" + startHour + '00', subDate + "T" +stopHour + '00', subName, "HAPPY " + vDay + ", " + vHall);
  //console.log(calVaues);

  return calVaues;
  
}


function textHelperTest() {
  // <td>CP5631-LA</td>
  // <td>Nov 09, 20</td><
  //   td>Mon</td>
  //   <td>09:00-11:50</td>
  //   <td>Online Class</td>
  var x = subTextHelper("CP5631-LA","Nov 09, 20","Mon","09:00-11:50","Online Class");
  console.log(x[0]);
  console.log(x[1]);
  //Use this to test the subTextHelper function

}

// $(function () {
//   textHelperTest()
//   })


function uuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16).toUpperCase();
    //UID format is this:70B29F20-07D2-4DC2-AF13-E4D8AB8849FE
    //Use this to avoid add to calendar for multiple times
});}



//Followed are jQuery functions  --  changed by Dezhi @2020-11-03
$(function() {
  //Add to linked as function trigger button
  $('.card:eq(1)').after('<a href="#" id="downloadCal">[- Download to Calendar -]</a>');
  $('.card:eq(1)').after('&nbsp;&nbsp;&nbsp;&nbsp;');
  $('.card:eq(1)').after('<a href="#" id="selectAll">[- Select All Classes -]</a>');
  $('.card:eq(1)').after('&nbsp;&nbsp;&nbsp;&nbsp;');

  //Select all function, loop the function of select one item
  //选择所有行，把选一行的操作给loop一下
  $('#selectAll').click(function () {
    //$("[name='checkbox']").prop('checked', 'true');
    $('.card:eq(1) tr:gt(0)').css('backgroundColor', 'PaleGreen');
    $('.card:eq(1) tr:gt(0)').addClass('iCalItem');
    $('.card:eq(1) tr:gt(0)').append('+');
  });

  //Select a single row(single Item)
  //选择某一行
  $('.card:eq(1) tr:gt(0)').click(function () { 
    $(this).css('backgroundColor', 'PaleGreen');
    $(this).addClass('iCalItem');
    $(this).append('+');
   });


  $('#downloadCal').click(function () {

    console.log('Start the download function...');
    var calResult = '';

    calResult = calHeaderFunc();

    //Process the line(s) with "Class" of "iCalItem"
    //选择class是iCalItem的行，然后进行处理咯
    $('.iCalItem').each(function () {
      var vClassCode = $(this).find('td:eq(0)').text();
      var vDate = $(this).find('td:eq(1)').text();
      var vDay = $(this).find('td:eq(2)').text();
      var vTime = $(this).find('td:eq(3)').text();
      var vHall = $(this).find('td:eq(4)').text();

      // console.log(classCode);
      // console.log(vDate);
    
      var calV = subTextHelper(vClassCode,vDate,vDay,vTime,vHall);
      //console.log(calV);

      var calEventResult = calEventFunc(calV[0], calV[1], calV[2], calV[3]);
      calResult += calEventResult;

    });

    calResult = calResult + calTailFunc();

    //console.log(calResult);

    if ($('.iCalItem').length == 0) {
      //Warn the user if nothing is selected.
      alert('Nothing selected..')
    }
    else {
      //Start the download function
      downloadFunc('sf-timetable.ics', calResult);
    }

  });
})

