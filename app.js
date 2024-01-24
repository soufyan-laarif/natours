const fs = require('fs');
const express = require('express');

const app = express();

// the middleware
app.use(express.json());

// app.get('/', (req, res) => res.status(200).send('Hello from the server side!'));
// app.get('/', (req, res) =>
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' })
// );

// app.post('/', (req, res) => res.send('You can post to this endpoint'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID !',
    });
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  console.log(req.body, typeof req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID !',
    });
  }

  res.status(200).json({
    status: 'success',
    message: '<Updated tour here ...>',
  });
};

const deleteTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID !',
    });
  }

  res.status(204).json({
    status: 'success',
    message: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => console.log(`App running on port ${port} ...`));
