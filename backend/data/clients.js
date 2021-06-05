const randomString = () =>
  Math.random().toString(36).substring(10, 15) +
  Math.random().toString(36).substring(10, 15);

const clients = [];
for (let i = 0; i < 40; i++) {
  const client = {
    name: randomString(),
    surname: randomString(),
    lastname: randomString(),
    contacts: [
      { type: "other", value: "@alvar91" },
      { type: "email", value: "aleksey91scorp@bk.ru" },
      { type: "vk", value: "alvar91" },
      { type: "fb", value: "alvar91" },
      { type: "phone", value: "+0(000)000-00-00" },
      { type: "other", value: "@alvar91" },
      { type: "other", value: "@alvar91" },
      { type: "other", value: "@alvar91" },
      { type: "other", value: "@alvar91" },
      { type: "other", value: "@alvar91" },
    ],
  };

  clients.push(client);
}

export default clients;
