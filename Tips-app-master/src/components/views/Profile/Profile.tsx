import React, { useEffect, useState } from 'react';
import './Profile.scss';
import useFormState from '../../../common/customHooks/useFormState';
import { AxiosResponse } from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getProfileData, editProfileData } from '../../../api/profile';
import { setAvatar, getAvatar } from '../../../api/photo';
import { setAvatarState } from '../../../store/actions/settings-actions';
import { ProfileDataResponse } from '../../../api/models/response/profileData-response.model';
import { setProfileData, deleteAvatarData } from '../../../store/actions/settings-actions';
import { AvatarResponse } from '../../../api/models/response/avatar-response.model';
import uploadAvatarIcon from '../../../assets/images/icons/upload-avatar.svg';
import deleteIcon from '../../../assets/images/icons/delete.svg';
import checkLoggedIn from '../../../common/checkLoggedIn';
import { NavLink } from 'react-router-dom';
import ModalPass from '../ModalPassword/ModalPass'

const Profile = () => {

    checkLoggedIn();

    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    const person = {
        name: useFormState(''),
        email: useFormState(''),
        restaurant: useFormState(''),
        photoUrl: useFormState('')
    }

    const setLocalState = (res:AxiosResponse) => {
        person.name.onChange({target: { value: res.data.person.name }})
        person.email.onChange({target: { value: res.data.person.email != null ? res.data.person.email : '' }}),
        person.restaurant.onChange({target: { value: res.data.restaurant.name }})
    }

    const profileState = useSelector((state:any) => state.ProfileReducer);
    const dispatch = useDispatch();

    const getProfile = () => {
        getProfileData()
            .then((response:AxiosResponse<ProfileDataResponse>) => {
                dispatch(setProfileData(response.data));
                setLocalState(response);
            })
            .catch(err => console.log(err))
    }

    const editProfile = (e:any) => {
        e.preventDefault();
        editProfileData(+profileState.restaurant.restaurantId, {
            name: person.name.value,
            email: person.email.value,
            address: profileState.person.address
        }).then((response:AxiosResponse<ProfileDataResponse>) => {
            dispatch(setProfileData(response.data))
            setLocalState(response);
            setSaved(true)
            setTimeout(() => setSaved(false), 3000);
        }).catch(err => console.log(err))
    }

    const onSelectFile = (e:any) => {
        if (e.target.files && e.target.files[0]) {
            const form = new FormData();
            form.append('file', e.target.files[0]);
            setAvatar(form)
                .then((response:AxiosResponse<AvatarResponse>) => {
                    dispatch(setAvatarState({ photoUrl: response.data.url }));
                })
                .catch(err => console.log(err));
        }
    }

    const deleteAvatar = () => {
        dispatch(deleteAvatarData())
        const form = new FormData();
            form.append('file', '');
            setAvatar(form)
                .then((response:AxiosResponse<AvatarResponse>) => {
                    dispatch(setAvatarState({ photoUrl: response.data.url }));
                })
                .catch(err => console.log(err));
        console.log(profileState)
    }

    const getPhoto = () => {
        getAvatar()
            .then((response:AxiosResponse<AvatarResponse>) => {
                dispatch(setAvatarState({photoUrl: response.data.url}))
            })
            .catch(err => console.log(err));
    }

    const generatePaymentLink = (e:any) => {
        e.preventDefault();
        const el = document.createElement('textarea');
        el.value = encodeURI(`${location.origin}/#/saythx/${profileState.userID}/${profileState.person.photoUrl}/${profileState.person.name}/${profileState.restaurant.name}`);
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true)
        setTimeout(() => setCopied(false), 3000);
    }

    useEffect(() => {
        if(profileState?.person.name === '') {
            getProfile()
        } else if(person.name.value === '') {
            setLocalState({data: {...profileState},
                status: NaN, statusText: '', config: {url:''}, headers: [] // Для соответствия типов
            })
        }
        profileState.person.photoUrl === undefined ? getPhoto() : null;
    });

    return(
        <React.Fragment>
            <div className="profile-avatar">
                <img src={'http://194.177.23.9:555/' + profileState.person?.photoUrl} alt="" className="avatar" />
                <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={onSelectFile} disabled={profileState.photoUrl} />
                <button className={ !profileState.person.photoUrl ? 'edit-avatar-btn avatar-active-action' : 'edit-avatar-btn'}>
                    <img src={uploadAvatarIcon} alt=""/>
                </button>
                <button className={ profileState.person.photoUrl ? 'delete-avatar-btn avatar-active-action' : 'delete-avatar-btn'} type="button" onClick={deleteAvatar}><img src={deleteIcon} alt=""/></button>
            </div>
            <form className="profile-form" onSubmit={editProfile}>
                <div className="main-input_with-label">
                    <input type="text" {...person.name} id="goal" className="main-input" required />
                    <label htmlFor="goal" className={person.name.value === '' ? 'null' : 'filled-input_label'}>Имя</label>
                </div>
                <div className="main-input_with-label">
                    <input type="text" {...person.email} id="period" className="main-input" required pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$" />
                    <label htmlFor="period" className={person.email.value === '' ? 'null' : 'filled-input_label'}>E-mail</label>
                </div>
                <div className="main-input_with-label">
                    <input type="text" {...person.restaurant} id="sum" className="main-input" disabled />
                    <label htmlFor="sum" className={person.restaurant.value === '' ? 'null' : 'filled-input_label'}>Ресторан</label>
                </div>
                <NavLink to="/changepassword" className="main-btn">СМЕНИТЬ ПАРОЛЬ</NavLink>
                <button type="submit" className={saved ? "main-btn saved-state" : "main-btn"}>СОХРАНИТЬ</button>
                <button onClick={generatePaymentLink} className={copied ? "main-btn copied-state" : "main-btn"}>Сгенерировать ссылку</button>
            </form>
        </React.Fragment>
    );
}

export default Profile;