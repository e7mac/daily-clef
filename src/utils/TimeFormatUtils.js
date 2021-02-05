export const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", timeZone: 'America/Los_Angeles' });
}

export const formatTime = (dateString) => {
	return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles' });
}

export const formatDateTime = (dateString) => {
	return formatDate(dateString) + " - " + formatTime(dateString)
}

export function formatDuration(time) {
	var hrs = Math.floor(time / 60 / 60)
	time = time % (60 * 60);
	var min = Math.floor(time / 60);
	var sec = time % 60;
	var sec_min = (min < 10 ? "0" : "");
	sec_min = (hrs > 0 ? hrs + ":" : "") + sec_min + min + ":" + (sec < 10 ? "0" : "");
	sec_min = sec_min + sec;
	return sec_min;
}
