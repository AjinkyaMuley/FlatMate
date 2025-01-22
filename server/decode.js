import jwt from 'jsonwebtoken'

const token = 'https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoibXVsZXlAZ21haWwuY29tIiwiaWF0IjoxNzM1NzM5ODMwLCJleHAiOjE3MzU4MjYyMzB9.IEi5SbAnwlQQuOU__yB82afFZWMsNTh03mPu42W47jo'; // Replace with your JWT
const decoded = jwt.decode(token); // Decodes without verifying the signature

console.log(decoded); // Prints the payload
