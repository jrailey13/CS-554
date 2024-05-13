//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.

import spaceRoutes from './routes.js';

const constructorMethod = (app) => {
    app.use('/api', spaceRoutes);
};

export default constructorMethod;