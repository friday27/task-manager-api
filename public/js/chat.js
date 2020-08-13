const socket = io();

// Elements
const $messageForm = document.querySelector('#msg-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const urlTemplate = document.querySelector('#url-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = () => {
    // New message element
    const $newMsg = $messages.lastElementChild;

    // Height of the last message
    const newMsgStyles = getComputedStyle($newMsg); // Find margin value
    const newMsgMargin = parseInt(newMsgStyles.marginBottom);
    const newMsgHeight = $newMsg.offsetHeight + newMsgMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of message container
    const containerHeight = $messages.scrollHeight;

    // How far have I scroll
    const scrollOffset = $messages.scrollTop + visibleHeight;

    // Make sure we are in the bottom before the message is added
    if (containerHeight - newMsgHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on('message', (msgObj) => {
    console.log(msgObj);
    const html = Mustache.render(messageTemplate, {
        username: msgObj.username,
        createdAt: moment(msgObj.createdAt).format('hh:mm a'),
        message: msgObj.text
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationMessage', (urlObj) => {
    console.log(urlObj);
    const html = Mustache.render(urlTemplate, {
        username: urlObj.username,
        createdAt: moment(urlObj.createdAt).format('hh:mm a'),
        url: urlObj.url
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refreshing

    // disable the submit button
    $messageFormButton.setAttribute('disabled', 'disabled');

    const msg = e.target.elements.msg.value;

    socket.emit('sendMessage', msg, (msg) => {
        // re-enable the submit button
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        console.log('The message was delivered!', msg);
    });
});

$locationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    $locationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            // Acknowledgement
            $locationButton.removeAttribute('disabled');
            // console.log('Location shared!');
        });
    });
});

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error);
        location.href = '/'; 
    }
});