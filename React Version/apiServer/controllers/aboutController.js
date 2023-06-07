const About = require('../models/aboutModel.js');

module.exports.updateAbout = async (req, res, next) => {
    try {
      const { information } = req.body;
      console.log(`Attempting to update about us content with information: "${information}"`);
      if (!information) {
        return res.status(400).json({ error: 'Missing required field' });
      }

      const about = await About.findOneAndUpdate({ _id: "6470dc364a25a34351d72000" }, {information},{new: true});
      if(!about){
        console.log('Error updating about us content')
        return res.status(500).json({ error: 'Error updating about us content' });

      }
      console.log('Information Updated', about) 
      return res.status(201).json({ message: 'Information Added Successfully' });
    } catch (err) {
      console.log(`Error updating about us content: ${err}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports.getAboutInfo = async (req, res, next) => {
    try {
      console.log('Fetching about us information')
      const about = await About.findOne({ _id: "6470dc364a25a34351d72000" }).select('information').exec();
      if (about) {
        return res.status(200).json({ information: about.information });
      } else {
        console.error('No information found')
        return res.status(400).json({ error: 'No information found for the given ID' });
      }
    } catch (err) {
      console.log(`Error retrieving about us content: ${err}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };