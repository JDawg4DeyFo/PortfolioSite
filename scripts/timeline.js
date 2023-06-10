document.addEventListener("DOMContentLoaded", function() {
	const points = document.querySelectorAll(".point");
	const labels = document.querySelectorAll(".date-label");

	const popup = document.querySelector(".popup");
	const popupClose = document.querySelector(".popup .close");
  
	points.forEach(function(point) {
		const LastHour = 7 * 24;
		const time = point.getAttribute("data-time");
		const TimeInteger = parseInt(time, 10);
		const BreakLine = document.createElement('br');

		const percentage = (TimeInteger / LastHour) * 100;
		point.style.left = percentage + "%";

		
		point.addEventListener("click", function() {
			const title = point.textContent;

			const searchstring = '[data-timep="' + time + '"]';
			const descriptionElements = document.querySelectorAll(searchstring);
  
			const popupContent = document.querySelector(".popup .content");
			popupContent.innerHTML = `
			<span class="close">&times;</span>
			<h2>${title}</h2>
			`;

			descriptionElements.forEach(function(desc) {
				const NewDescriptionPElement = document.createElement('p');
				NewDescriptionPElement.textContent = desc.textContent;

				popupContent.append(NewDescriptionPElement);
				popupContent.append(BreakLine);
			});
  
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