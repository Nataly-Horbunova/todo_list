class RealTimeClock {
    constructor() {
        this.timeElement = document.querySelector('.current-time');
        this.dateElement = document.querySelector('.current-date');
        this.updateClock();
        setInterval(this.updateClock.bind(this), 1000);
    }

    updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();

        const timeString = `${hours}:${minutes}`;
        const dateString = `${day} ${month}, ${year}`;

        this.timeElement.textContent = timeString;
        this.dateElement.textContent = dateString;
    }
}