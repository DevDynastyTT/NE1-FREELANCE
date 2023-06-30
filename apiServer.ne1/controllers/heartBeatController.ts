let count = 1

export default function heartBeat (request, response) {
    console.log('Response', count++)
    response.json({ status: true });
  };