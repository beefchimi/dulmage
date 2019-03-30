export default class Notification {
  constructor(message) {
    const template = document.getElementById('NotificationTemplate');

    this.notification = template.content.cloneNode(true);
    this.message = message;

    this._setMessage();
  }

  getNotification() {
    return this.notification;
  }

  _setMessage() {
    const messageNode = this.notification.querySelector('.NotificationMessage');
    messageNode.textContent = this.message;
  }
}
