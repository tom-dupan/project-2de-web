// Once submit is clicked
document.getElementById('submit').addEventListener('click', e => {
    e.preventDefault(); // No refresh

    // If username/password empty
    if (!document.getElementById('naam').value.trim() || !document.getElementById('paswoord').value.trim()) {

        // Create alert
        let alert = document.createElement('div');
        alert.classList = 'alert';
        alert.innerHTML =
            '<span class="close">&times;</span><span>Please enter a username and password!</span>';
        alert.getElementsByClassName('close')[0].addEventListener('click', () => alert.remove()); // Remove alert with 'X'
        document.getElementsByClassName('register-box')[0].appendChild(alert); // Add alert to page

        // Remove alert after 3.5s
        setTimeout(() => {
            alert.remove();
        }, 3500);

        return;
    }

    // Username & password filled in
    let xmlhttp = new XMLHttpRequest();

    // Request to server
    xmlhttp.open('POST', `/registerUser`);
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xmlhttp.send(JSON.stringify({
        "naam": document.getElementById('naam').value,
        "paswoord": document.getElementById('paswoord').value
    }));

    // Once request is handled
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                let result = xmlhttp.responseText;

                let alert = document.createElement('div');
                alert.classList = 'alert';

                // Show result
                switch (result) {
                    case 'user_added':
                        alert.classList.add('green');
                        alert.innerHTML =
                            '<span class="close">&times;</span><span>You have been registered!</span>';
                            window.location.href = '/home';
                        break;

                    case 'user_exists':
                        alert.innerHTML =
                            '<span class="close">&times;</span><span>This username is already taken!</span>';
                        break;

                    case 'invalid':
                        alert.innerHTML = 
                            '<span class="close">&times;</span><span>This username cannot be used.</span>';
                        break;

                    default:
                        alert.classList.add('orange');
                        alert.innerHTML =
                            '<span class="close">&times;</span><span>An error has occurred... Try again later.</span>';
                }

                // Add alert + action to dismiss
                alert.getElementsByClassName('close')[0].addEventListener('click', () => alert.remove()); // Remove alert with 'X'
                document.getElementsByClassName('register-box')[0].appendChild(alert); // Add alert to page

                // Remove alert
                setTimeout(() => {
                    alert.remove();
                }, 3500);

            } else {
                alert('something else other than 200 was returned');
            }
        }
    };

});