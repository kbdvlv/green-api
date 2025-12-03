const translations = {
	en: {
		answerLabel: "Answer",
		phonePlaceholder: "Phone number",
		msgPlaceholder: "Hello World!",
		urlPlaceholder: "https://site.com/image.png",
		idInstance: "idInstance",
		apiTokenInstance: "ApiTokenInstance",
		alertId: "Please fill in idInstance and ApiTokenInstance",
		alertPhone: "Please fill in the phone number",
		alertMsg: "Please fill in the message text",
		alertUrl: "Please fill in the file URL",
		copyTooltip: "Copy",
		copiedTooltip: "Copied!"
	},
	ru: {
		answerLabel: "Ответ",
		phonePlaceholder: "Номер телефона",
		msgPlaceholder: "Привет, мир!",
		urlPlaceholder: "https://site.com/image.png",
		idInstance: "idInstance",
		apiTokenInstance: "ApiTokenInstance",
		alertId: "Пожалуйста, заполните idInstance и ApiTokenInstance",
		alertPhone: "Пожалуйста, заполните номер телефона",
		alertMsg: "Пожалуйста, заполните текст сообщения",
		alertUrl: "Пожалуйста, заполните ссылку на файл",
		copyTooltip: "Копировать",
		copiedTooltip: "Скопировано!"
	}
};
let currentLang = 'en';
window.onload = function() {
	const userLang = navigator.language || navigator.userLanguage;
	if (userLang.toLowerCase().startsWith('ru')) {
		currentLang = 'ru';
	}
	else {
		currentLang = 'en';
	}
	applyLanguage(currentLang);
};

function toggleTheme() {
	document.body.classList.toggle('dark-theme');
}

function toggleLanguage() {
	currentLang = currentLang === 'en' ? 'ru' : 'en';
	applyLanguage(currentLang);
}

function applyLanguage(lang) {
	document.getElementById('langBtn').textContent = lang.toUpperCase();
	const textElements = document.querySelectorAll('[data-i18n]');
	textElements.forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (translations[lang][key]) el.textContent = translations[lang][key];
	});
	const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
	placeholderElements.forEach(el => {
		const key = el.getAttribute('data-i18n-placeholder');
		if (translations[lang][key]) el.placeholder = translations[lang][key];
	});
	const tooltipElements = document.querySelectorAll('[data-i18n-tooltip]');
	tooltipElements.forEach(el => {
		const key = el.getAttribute('data-i18n-tooltip');
		if (translations[lang][key]) el.setAttribute('data-tooltip', translations[lang][key]);
	});
}

function t(key) {
	return translations[currentLang][key];
}

function copyResponse() {
	const field = document.getElementById('response-field');
	if (!field.value) return;
	navigator.clipboard.writeText(field.value).then(() => {
		const btn = document.querySelector('.copy-btn');
		const originalText = btn.getAttribute('data-tooltip');
		btn.setAttribute('data-tooltip', t('copiedTooltip'));
		setTimeout(() => {
			btn.setAttribute('data-tooltip', originalText);
		}, 2000);
	}).catch(err => {
		console.error('Failed to copy: ', err);
	});
}

function outputResponse(data) {
	const field = document.getElementById('response-field');
	field.value = JSON.stringify(data, null, 4);
}

function getApiUrl(method) {
	const idInstance = document.getElementById('idInstance').value;
	const apiTokenInstance = document.getElementById('apiTokenInstance').value;
	if (!idInstance || !apiTokenInstance) {
		alert(t('alertId'));
		return null;
	}
	return `https://api.green-api.com/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}
async function getSettings() {
	const url = getApiUrl('getSettings');
	if (!url) return;
	try {
		const response = await fetch(url, {
			method: 'GET'
		});
		const data = await response.json();
		outputResponse(data);
	}
	catch (error) {
		outputResponse({
			error: error.message
		});
	}
}
async function getStateInstance() {
	const url = getApiUrl('getStateInstance');
	if (!url) return;
	try {
		const response = await fetch(url, {
			method: 'GET'
		});
		const data = await response.json();
		outputResponse(data);
	}
	catch (error) {
		outputResponse({
			error: error.message
		});
	}
}
async function sendMessage() {
	const url = getApiUrl('sendMessage');
	if (!url) return;
	const number = document.getElementById('chatIdNumberMessage').value;
	const suffix = document.getElementById('chatIdSuffixMessage').value;
	if (!number) {
		alert(t('alertPhone'));
		return;
	}
	const chatId = number + suffix;
	const message = document.getElementById('messageText').value;
	if (!message) {
		alert(t('alertMsg'));
		return;
	}
	const payload = {
		chatId: chatId,
		message: message
	};
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		const data = await response.json();
		outputResponse(data);
	}
	catch (error) {
		outputResponse({
			error: error.message
		});
	}
}
async function sendFileByUrl() {
	const url = getApiUrl('sendFileByUrl');
	if (!url) return;
	const number = document.getElementById('chatIdNumberFile').value;
	const suffix = document.getElementById('chatIdSuffixFile').value;
	if (!number) {
		alert(t('alertPhone'));
		return;
	}
	const chatId = number + suffix;
	const fileUrl = document.getElementById('fileUrl').value;
	if (!fileUrl) {
		alert(t('alertUrl'));
		return;
	}
	let fileName = 'file';
	try {
		const urlObj = new URL(fileUrl);
		const pathSegments = urlObj.pathname.split('/');
		const lastSegment = pathSegments[pathSegments.length - 1];
		if (lastSegment) fileName = lastSegment;
	}
	catch (e) {
		console.log(':(');
	}
	const payload = {
		chatId: chatId,
		urlFile: fileUrl,
		fileName: fileName
	};
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		const data = await response.json();
		outputResponse(data);
	}
	catch (error) {
		outputResponse({
			error: error.message
		});
	}
}