const pubSub = {
  state: {},

  subscribe(event, id, fn) {
    if (this.state[event]) {
      this.state[event].push({id, fn});
    } else {
      this.state[event] = [{id, fn}];
    }
  },

  unsubscribe(event, id) {
    const eventArr = this.state[event];

    if (eventArr) {
      const idx = eventArr.findIndex((sub) => sub.id === id);
      eventArr.splice(idx, 1);
    }
  },

  publish(event, data) {
    this.state[event].forEach((sub) => {
      sub.fn(data);
    });
  },
};

module.exports = pubSub;
