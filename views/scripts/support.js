/* request options */
// send message
async function postData(url = '', data) {
    const response = await fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        text: data
      })
    });
  
    return await response.json();
  }
  
  // get messages
  async function getMessages(count) {
    let numbTime = (count == 0) ? 1 : parseInt(new Date().getTime() / 1000)
    const response = await fetch(`api/getMessages/${window.location.pathname.split('/')[3]}/${numbTime}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer'
    })
  
    return await response.json()
  }
  
  var $messages = $('.messages-content'),
      d, h, m,
      i = 0;
  
  $(window).load(function() {
    $messages.mCustomScrollbar();
    if (getCount() == 0) {
      getMessages(0).then(async (res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].who == "Support") {
              supportMessage(res[i].text)
          } else {
            spawnDefMSG(res[i].text)
          }
        }
      })
    }
  });
  
  function getCount() {
    return $('#mCSB_1_container').children('div').length
  }
  
  function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }
  
  function setDate(){
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
      $('<div class="checkmark-sent-delivered">&check;</div>').appendTo($('.message:last'));
      $('<div class="checkmark-read">&check;</div>').appendTo($('.message:last'));
    }
  }
  
  function insertMessage() {
    msg = $('.message-input').val();
  
    if ($.trim(msg) == '') {
      return false;
    }
  
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
  
    updateScrollbar();
  
    postData(`/api/sendMessage/${window.location.pathname.split('/')[3]}`, msg)
  }
  
  $('.message-submit').click(function() {
    insertMessage();
  });
  
  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  })
  
  function spawnDefMSG(msg) {
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
  
    updateScrollbar();
  }
  
  function supportMessage(msg) {
    $('<div class="message loading new"><figure class="avatar"><img src="https://img.freepik.com/free-vector/flat-doctor-avatar-website-chat-window-support-message-chatting-app-isolated-white-background_111651-583.jpg?size=338&ext=jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();
  
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="https://img.freepik.com/free-vector/flat-doctor-avatar-website-chat-window-support-message-chatting-app-isolated-white-background_111651-583.jpg?size=338&ext=jpg" /></figure>' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
  }
  
  setInterval(() => {
    fetch(`/api/getMessages/${window.location.pathname.split('/')[3]}/${parseInt(new Date().getTime() / 1000)}`).then(async (res) => {
      if (res.status == 200) {
        return await res.json()
      }
    }).then(async (res) => {
      supportMessage(res.text)
    })
  }, 1000);
  
  
  $('.button').click(function(){
    $('.menu .items span').toggleClass('active');
     $('.menu .button').toggleClass('active');
  });