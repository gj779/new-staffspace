import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AbsoluteWrapper, ButtonColored, ComponentWrapper, EditClose, IconWithText, ImageRound, KeyboardAvoidingScrollView, LargeText, MainHeader, MainWrapper, MediumText, RegularText, SelectionModal, SmallText, Spacer, TextInputBordered, TextInputColored, TinyTitle, Wrapper } from '../../../components'
import { appImages, appStyles, colors, routes, sizes } from '../../../services'
import { height, totalSize, width } from 'react-native-dimension'
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { saveData, uniqueID, uploadProfileImage } from '../../../backend/utility'
import { signin } from '../../../redux/actions'
import SimpleToast from 'react-native-simple-toast'

const EditProfile = ({ navigation }) => {
    const dispatch = useDispatch()
    const user_redux = useSelector(state => state?.user)
    const [name, setName] = useState(user_redux?.username)
    const [nameError, setNameError] = useState('')
    const [phone, setPhone] = useState(user_redux?.phoneNo)
    const [phoneError, setPhoneError] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState(user_redux?.description)
    const [descriptionError, setDescriptionError] = useState('')
    const [isSelectionModalVisible, setSelectionModalVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const { navigate } = navigation
    useEffect(() => {
        // console.log('user Redux', user_redux)
    }, [])
    const HandleUpdate = () => {
        let Data = {
            username: name,
            phoneNo: phone,
            description: description,
        }
        if (image) {
            setLoading(true)
            uploadProfileImage(image.uri, `${user_redux.userType}/Images/profileImages/${uniqueID()}${image.fileName}`)
                .then(img => {
                    let user = {
                        ...user_redux
                    }
                    user.username = name
                    user.phoneNo = phone
                    user.description = description
                    user.profilePhoto = img
                    dispatch(signin(user))
                    setLoading(false)
                    SimpleToast.show('Profile Updated')
                    navigation.goBack()
                    Data.profilePhoto = img
                    saveData('Users', user_redux.user_id, Data).catch(err => setLoading(false))
                }).catch(err => setLoading(false))
        }
        else {
            let user = {
                ...user_redux
            }
            user.username = name
            user.phoneNo = phone
            user.description = description
            dispatch(signin(user))
            SimpleToast.show('Profile Updated')
            navigation.goBack()
            saveData('Users', user_redux.user_id, Data)
        }
    }
    const PickPhotoFromGallery = async () => {
        setSelectionModalVisible(false)
        try {
            const data = await ImagePicker.openPicker({
                width: 1080,
                height: 1080,
                cropping: true
            }).then(image => {
                let filename = image.path.substring(image.path.lastIndexOf('/') + 1)
                setImage({ uri: image.path, fileName: filename })
            });
        } catch (e) {
            console.log(e)
        }
    }
    const takePhotoFromCamera = async () => {
        setSelectionModalVisible(false)
        try {
            const data = await ImagePicker.openCamera({
                width: 1080,
                height: 1080,
                cropping: true,
                compressImageMaxHeight: 500,
                compressImageMaxWidth: 500,
            }).then(image => {
                console.log(image)
                let filename = image.path.substring(image.path.lastIndexOf('/') + 1)
                setImage({ uri: image.path, fileName: filename })
            });
        } catch (e) { console.log(e) }
    }
    const HandleChangeImage = () => { setSelectionModalVisible(true) }
    return (
        <MainWrapper>
            <Wrapper flex={1} style={appStyles.mainContainer}>
                <MainHeader title='Edit Profile' buttonSize={totalSize(3)}
                    onPressBack={() => navigation.goBack()} />
                <KeyboardAvoidingScrollView>
                    <Spacer height={sizes.baseMargin} />
                    <ComponentWrapper>
                        <TinyTitle>Personal Information</TinyTitle>
                    </ComponentWrapper>
                    <Spacer height={sizes.baseMargin} />
                    <Wrapper style={[appStyles.center]}>
                        <Wrapper style={{ width: totalSize(13), height: totalSize(13) }}>
                            <ImageRound source={{ uri: image ? image?.uri : user_redux?.profilePhoto }} size={totalSize(13)} />
                            <AbsoluteWrapper style={{ bottom: 5, right: 5 }}>
                                <TouchableOpacity activeOpacity={.6} onPress={HandleChangeImage}>
                                    <Wrapper style={[styles.editIconWrapper]}>
                                        <EditClose />
                                    </Wrapper>
                                </TouchableOpacity>
                                <SelectionModal
                                    isVisible={isSelectionModalVisible}
                                    toggleModal={() => setSelectionModalVisible(false)}
                                    onPressCamera={takePhotoFromCamera}
                                    onPressGallery={PickPhotoFromGallery}
                                />
                            </AbsoluteWrapper>
                        </Wrapper>
                    </Wrapper>
                    <Spacer height={sizes.smallMargin} />
                    <TextInputColored
                        value={name}
                        onChangeText={text => {
                            setName(text)
                            setNameError('')
                        }}
                        error={nameError}
                        inputContainerStyle={styles.textInputContainer}
                        inputStyle={styles.textInputText}
                        placeholder='Name' />
                    <TextInputColored
                        value={user_redux?.email}
                        editable={false}
                        inputContainerStyle={styles.textInputContainer}
                        inputStyle={styles.textInputText}
                        placeholder='Email' />
                    <TextInputColored
                        value={phone}
                        onChangeText={text => {
                            setPhone(text)
                            setPhoneError('')
                        }}
                        error={phoneError}
                        inputContainerStyle={styles.textInputContainer}
                        inputStyle={styles.textInputText}
                        placeholder='Phone number' />
                    <Spacer height={sizes.baseMargin} />
                    <ComponentWrapper>
                        <LargeText style={{ color: colors.appTextColor7 }}>Description</LargeText>
                    </ComponentWrapper>
                    <Spacer height={sizes.TinyMargin} />
                    <TextInputBordered
                        value={description}
                        onChangeText={text => {
                            setDescription(text)
                            setDescriptionError('')
                        }}
                        error={descriptionError}
                        inputStyle={styles.textInputDescription}
                        containerStyle={{ borderColor: colors.appTextColor7 }}
                        multiline
                        iconColor={colors.primary}
                        iconSize={sizes.icons.large} />
                    <Spacer height={sizes.doubleBaseMargin} />
                    <Wrapper style={[appStyles.center]}>
                        <ButtonColored
                            onPress={HandleUpdate}
                            disabled={isLoading}
                            buttonStyle={{ width: width(70) }}
                            text={isLoading ? <ActivityIndicator color={colors.appTextColor6} /> : 'Save Changes'} buttonColor={colors.primary} />
                    </Wrapper>
                    <Spacer height={sizes.baseMargin} />
                </KeyboardAvoidingScrollView>
            </Wrapper>
        </MainWrapper>
    )
}
export default EditProfile

const styles = StyleSheet.create({
    textInputContainer: {
        backgroundColor: colors.appColor8,
        marginVertical: sizes.TinyMargin
    },
    textInputText: {
        height: height(7),
        color: colors.primary,
    },
    textInputDescription: {
        height: height(20),
        color: colors.primary,
        textAlignVertical: 'top',
    },
    editIconWrapper: {
        backgroundColor: '#FFF',
        height: totalSize(3.5),
        width: totalSize(3.5),
        borderRadius: totalSize(2),
        ...appStyles.shadow,
        ...appStyles.center,
    }
})