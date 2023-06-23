let count = 1

module.exports.heartBeat = (request, response) => {
    console.log('Response', count++)
    response.json({ status: true });
  };