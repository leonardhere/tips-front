import React, {Component} from 'react'
import classes from './QuizCreator.module.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import {createControl, validate, validateForm} from '../../form/formFremework'
import Select from '../../components/UI/Select/Select'
import Auxillary from '../../hoc/Auxillary/Auxillary'
import axios from '../../axios/axios-quiz'

function createOptionControl(number) {
    return createControl(
        {
            label: `Вариант ${number}`,
            errorMessage: 'Значение не может быть пустым',
            id: number
        }, {required: true}
    )
}
//функция для обнуления state при добавлении нового вопроса
function createFormControls() {
    return{
        question: createControl({
            label: 'Введите вопрос',
            errorMessage: 'Строка должна быть заполнена.'
        }, {
            required: true
        }),
        option1: createOptionControl(1),
        option2: createOptionControl(2),
        option3: createOptionControl(3),
        option4: createOptionControl(4)
    }
}

export default class QuizCreator extends Component {
    state = {
        quiz: [],
        isFormValid: false, //проверка валидности состояния формы
        rightAnswerId: 1,
        formControls: createFormControls()
    }

    submitHandler = (event) => {
        event.preventDefault()
    }

    //функция, добавляющая новый вопрос.
    addQuestionHandler = (event) => {
        event.preventDefault()
        const quiz = this.state.quiz.concat()
        const index = quiz.length +1
        const {question, option1, option2, option3, option4} = this.state.formControls
        //сокращаем код, дабы не дописывать везде this.state.formControls перед option и question, занося это в переменную, применяя деструктуризацию
        const questionItem = {
            question: question.value,
            id: index,
            rightAnswerId: this.state.rightAnswerId,
            answers: [
                {text: option1.value, id: option1.id},
                {text: option2.value, id: option2.id},
                {text: option3.value, id: option3.id},
                {text: option4.value, id: option4.id}
            ]
        }
        //создаём объект вопроса, передавая в него сам вопрос, id вопроса, правильный ответ и варианты ответа
        quiz.push(questionItem)
        //добавляем вопрос в quiz
        this.setState({
            quiz,
            isFormValid: false, 
            rightAnswerId: 1,
            formControls: createFormControls()
        })
    }

    createQuizHandler = async (event) => {
        event.preventDefault()
        try{
            await axios.post('/quizes.json', this.state.quiz)
            this.setState({
                quiz: [],
                isFormValid: false, 
                rightAnswerId: 1,
                formControls: createFormControls()
            })
            //Обнуляем state после отправки вопроса на сервер
            
        } catch(e) {
            console.log(e);
            
        }
    }

    //клонируем state
    changeHandler = (value, controlName) => {
        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}

        control.touched = true
        control.value = value
        control.valid = validate(control.value, control.validation)

        formControls[controlName] = control
        this.setState({
            formControls,
            isFormValid: validateForm(formControls)
        })
    }
    //функция, отвечающая за генерацию инпутов
    renderControls = () => {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]

            return(
                <Auxillary key={controlName + index}>
                    <Input
                        label = {control.label}
                        value = {control.value}
                        valid = {control.valid}
                        shouldValidate = {!!control.validation}
                        touched = {control.touched}
                        errorMessage = {control.errorMessage}
                        onChange = {event => {
                            this.changeHandler(event.target.value, controlName)
                        }}
                    />
                    { index === 0? <hr/> : null }
                </Auxillary>
            )
        })
    }

    selectChangeHandler = (event) => {
        this.setState({
            rightAnswerId: +event.target.value
        })
    }


    render() {
        const select = <Select
            label="Выберите правильный ответ"
            value={this.state.rightAnswerId}
            onChange={this.selectChangeHandler}
            options={[
                {
                    text: 1,
                    value: 1
                },
                {
                    text: 2,
                    value: 2
                },
                {
                    text: 3,
                    value: 3
                },
                {
                    text: 4,
                    value: 4
                }
            ]}
        />
        return(
            <div className={classes.QuizCreator}>
            <div>
                <h1>Создание теста</h1>
                <form onSubmit={this.submitHandler}>
                        {this.renderControls()}
                    {select}
                    <Button type="primary" onClick={this.addQuestionHandler} disabled={!this.state.isFormValid}>Добавить вопрос</Button>
                    <Button type="success" onClick={this.createQuizHandler} disabled={this.state.quiz.length === 0}>Создать тест</Button>
                </form>
            </div>
            </div>
        )
    }
}