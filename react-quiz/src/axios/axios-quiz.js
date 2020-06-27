import axios from 'axios'

export default axios.create({
    baseURL: 'https://leo-react-quiz.firebaseio.com'
})