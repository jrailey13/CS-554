//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.

import blogRoutes from './blogRoutes.js';

const constructorMethod = (app) => {
    app.use('/sitblog', blogRoutes);
    // app.use('*', (req, res) => {
    //     res.redirect('/sitblog');
    // });
};

export default constructorMethod;