const getLocation = async () => {
  return new Promise(resolve => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            coordinates: [
              position.coords.latitude,
              position.coords.longitude
            ]
          });
        },
        () => resolve(null)
      );
    } else {
      resolve(null);
    }
  });
};

export default getLocation;
