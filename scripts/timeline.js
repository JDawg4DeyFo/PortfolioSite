document.addEventListener("DOMContentLoaded", function() {
	const points = document.querySelectorAll(".point");
	const labels = document.querySelectorAll(".date-label");

	const popup = document.querySelector(".popup");
	const popupClose = document.querySelector(".popup .close");
  
	points.forEach(function(point) {
		const LastHour = 7 * 24;
		const time = point.getAttribute("data-time");
		const TimeInteger = parseInt(time, 10);

		const percentage = (TimeInteger / LastHour) * 100;
		point.style.left = percentage + "%";

		
		point.addEventListener("click", function() {
			const title = point.textContent;

			const searchstring = '[data-timep="' + time + '"]';
			const descriptionElement = document.querySelector(searchstring);
			const description = descriptionElement.textContent;
  
			const popupContent = document.querySelector(".popup .content");
			popupContent.innerHTML = `
			<span class="close">&times;</span>
			<h2>${title}</h2>
			<p>${description}</p>
			`;
  
			popup.style.display = "block";
		});
	});

	labels.forEach(function(label, index) {
		const percentage = (index / 7) * 100;

		label.style.left = percentage + "%";
	});
  
	document.addEventListener("click", function(event) {
	  if (event.target.classList.contains("close")) {
		popup.style.display = "none";
	  }
	});
  
	document.addEventListener("keydown", function(event) {
	  if (event.key === "Escape") {
		popup.style.display = "none";
	  }
	});
  });