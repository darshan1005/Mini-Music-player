function checkInternetConnection() {
  if (navigator.onLine) {
    // The browser is online
    console.log("Internet connection detected");
  } else {
    // The browser is offline, display the message
    console.log("No internet connection detected");
    document.getElementById("internetIssueMessage").style.display = "block";
    document.querySelector('.loading').style.display = 'block';
  }
}

// Call the function to check internet connection
checkInternetConnection();

// Add event listener for online/offline events
window.addEventListener('online', () => {
  console.log('Internet connection established');
  document.getElementById('internetIssueMessage').innerText = "✅Hurry! You're back online";
  document.getElementById('internetIssueMessage').style.color = 'black';
  document.getElementById('internetIssueMessage').style.background = 'lightgreen'
  setTimeout(() => {
    window.location.reload();
  }, 2000);
});

window.addEventListener("offline", () => {
  console.log("Internet connection lost");
  // Check for internet connection when it's lost
  window.location.reload();
  checkInternetConnection();
});
