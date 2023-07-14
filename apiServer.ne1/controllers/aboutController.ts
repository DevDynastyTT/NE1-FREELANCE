import AboutUs from '../models/aboutModel';

const updateAbout = async (request, response) => {
    try {
      const { information } = request.body;
      console.log(`Attempting to update about us content with information: "${information}"`);
      if (!information) {
        return response.status(400).json({ error: 'Missing required field' });
      }

      //Update the about us information with update id field that contains 1 1
      const about = await AboutUs.findOneAndUpdate({ update: 1 }, {information},{new: true});
      if(!about){
        console.log('Error updating about us content')
        return response.status(500).json({ error: 'Error updating about us content' });

      }
      console.log('Information Updated', about) 
      return response.status(201).json({ message: 'Information Added Successfully' });
    } catch (err) {
      console.log(`Error updating about us content: ${err}`);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  };

const getAboutInfo = async (request, response) => {
  try {
    console.log('Fetching about us information')
    const about = await AboutUs.findOne({ _id: "6470dc364a25a34351d72000" }).select('information').exec();
    if (about) {
      return response.status(200).json({ information: about.information });
    } else {
      console.error('No information found')
      return response.status(400).json({ error: 'No information found for the given ID' });
    }
  } catch (err) {
    console.log(`Error retrieving about us content: ${err}`);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  updateAbout,
  getAboutInfo
}