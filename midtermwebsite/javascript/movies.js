function toggleSeen(button) {
    // Toggle button text and color
    if (button.classList.contains("btn-warning")) {
        button.classList.remove("btn-warning");
        button.classList.add("btn-success");
        button.textContent = "I have seen this movie";
    } else {
        button.classList.remove("btn-success");
        button.classList.add("btn-warning");
        button.textContent = "I haven't seen this movie yet";
    }
}
