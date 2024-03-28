import { View, Text, PermissionsAndroid, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { AppLogo1, ButtonColored, ButtonWithIcon, CheckBoxPrimary, CheckBoxSelector, ComponentWrapper, CustomizedModel, IconWithText, KeyboardAvoidingScrollView, LargeText, LargeTitle, LineHorizontal, LocationModal, MainWrapper, ManualLocationModal, RoundedWrapper, RowWrapper, RowWrapperBasic, SelectionModal, SmallText, SmallTitle, Spacer, TextInputBordered, TextInputBorderedPassword, TextInputSimpleBordered, TinyText, TinyTitle, Wrapper, XLTitle, XXLTitle } from '../../../components'
import { height, totalSize, width } from 'react-native-dimension'
import { appImages, appStyles, colors, PickPhotoFromGallery, routes, sizes, takePhotoFromCamera } from '../../../services'
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';
import { checkEmailAlreadyInUse, signUp } from '../../../backend/auth'
import Validations from '../../../services/validations'
import Toast from 'react-native-simple-toast'

const Signup = ({ navigation }) => {
    const { navigate } = navigation

    const [userName, setuserName] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [acceptLicense, setAcceptLicense] = useState(false);
    const [location, setLocation] = useState({ lat: '', long: '' })

    const [checked, setChecked] = useState('Applicant')
    const [visible, setVisible] = useState(false)
    const [shown, setShown] = useState(false)
    const [image, setImage] = useState({ uri: '', fileName: '' });
    const [toggle, setToggle] = useState(true);
    const [toggle1, setToggle1] = useState(true);

    const [isLoading, setLoading] = useState(false);

    const [isSelectionModalVisible, setSelectionModalVisible] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState('');
    const config = { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }

    const requestLocationPermession = async () => {
        let USER = {
            username: userName,
            email: email.trim(),
            phoneNo: phone,
            password: password.trim(),
            userType: checked,
        }
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Location Permission',
                        'message': 'Staff Space needs access to your location'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                        info => {
                            let User1 = {
                                ...USER,
                                location: { lat: info.coords.latitude, long: info.coords.longitude }
                            }
                            setVisible(false)
                            navigation.navigate(routes.currentJobDetail, { User: User1, image: image })
                        },
                        error => console.log(error),
                        config
                    );
                    console.log("Location permission granted")
                } else {
                    console.log("Location permission denied")
                }
            }
            else {
                Geolocation.requestAuthorization('whenInUse').then((res) => {
                    if (res = 'granted') {
                        Geolocation.getCurrentPosition(
                            info => {
                                let User1 = {
                                    ...USER,
                                    location: { lat: info.coords.latitude, long: info.coords.longitude }
                                }
                                setVisible(false)
                                navigation.navigate(routes.currentJobDetail, { User: User1, image: image })
                            },
                            error => console.log(error),
                            config
                        );
                    }
                })
            }

        } catch (err) {
            console.warn(err)
        }
    }

    const AddfromCamera = async () => {
        try {
            let img = await takePhotoFromCamera()
            setSelectionModalVisible(false)
            if (img) {
                let filename = img.path.substring(img?.path?.lastIndexOf('/') + 1)
                setImage({ uri: img.path, fileName: filename })
            }
        } catch (error) {
            console.log(error)
        }
    }
    const PickFromGalllary = async () => {
        try {
            let img = await PickPhotoFromGallery()
            setSelectionModalVisible(false)
            if (img) {
                let filename = img?.path.substring(img?.path?.lastIndexOf('/') + 1)
                setImage({ uri: img?.path, fileName: filename })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const HandleBackPress = () => {
        setShown(!shown)
    }
    const HandlePressContinue = () => {
        setVisible(!visible)
        setShown(false)
        navigation.navigate(routes.currentJobDetail)

    }
    const handlePressSignUp = async () => {
        setLoading(true)
        let USER = {
            username: userName,
            email: email.trim(),
            phoneNo: phone,
            password: password.trim(),
            userType: checked,
        }
        if (validations()) {
            await checkEmailAlreadyInUse(email.trim(), ((response) => {
                if (response) {
                    setLoading(false)
                    setEmailError(`${email} is already in use.`)
                } else {
                    setLoading(false)
                    switch (checked) {
                        case 'Applicant':
                            setVisible(true)
                            break;
                        case 'Resturant':
                            navigate(routes.resturantSignupInfo, { USER: USER, image: image })
                            break;
                        case 'Event':
                            navigate(routes.resturantSignupInfo, { USER: USER, image: image })
                            break;
                        default:
                            console.log('please Select Account Type')
                    }
                }
            }))
        }
        else {
            setLoading(false)
        }
    }
    const validations = () => {
        !userName ? setUserNameError('Please enter your username, it is a required field') : userName.length < 3 ? setUserNameError('username Must be at least 3 characters') : setUserNameError('')
        !email ? setEmailError('Please enter your email, it is a required field') : !Validations.validateEmail(email) ? setEmailError('Email format is invalid') : setEmailError('')
        // !phone ? setPhoneError('Please enter your phone Number, it is a required field') : setPhoneError('')
        !password ? setPasswordError('Please enter your password, it is a required field') : password.length < 6 ? setPasswordError('Password should be at least 6 characters long') : setPasswordError('')
        !confirmPassword ? setConfirmPasswordError('Enter Confirm password') : confirmPassword.length < 6 ? setConfirmPasswordError('Confirm password should be at least 6 characters long') : confirmPassword != password ? setConfirmPasswordError('Confirm Password doest not match with Password') : setConfirmPasswordError('')
        acceptLicense == false ? Toast.show('Please accept Privacy Policy and Terms & Conditions') : null
        // if (userName.length >= 3 && email && password.length >= 6 && Validations.validateEmail(email) && confirmPassword && phone && acceptLicense && Validations.validatePassword(password) && Validations.validatePassword(confirmPassword) && (password === confirmPassword)) {
        if (userName.length >= 3 && email && password.length >= 6 && Validations.validateEmail(email) && confirmPassword && acceptLicense && Validations.validatePassword(password) && Validations.validatePassword(confirmPassword) && (password === confirmPassword)) {
            return true
        } else {
            return false
        }
    }

    return (
        <MainWrapper>
            <Wrapper flex={1} animation="fadeInUp">
                <KeyboardAvoidingScrollView>
                    <Spacer height={sizes.doubleBaseMargin} />
                    <Wrapper style={appStyles.center}>
                        {/* <AppLogo1 height={totalSize(15)} width={totalSize(25)} source={appImages.logoIcon} /> */}
                        <AppLogo1 height={totalSize(15)} width={totalSize(25)} source={appImages.logo} />
                    </Wrapper>
                    <ComponentWrapper >
                        <LargeTitle style={{ color: colors.appTextColor2, alignSelf: "center" }}>Let’s Get Started</LargeTitle>
                        <TinyTitle style={{ color: colors.appTextColor5, marginVertical: 20 }}>It won’t take more than minute.</TinyTitle>
                    </ComponentWrapper>
                    {/* <Wrapper style={appStyles.center}>
                        <RoundedWrapper style={styles.roundedWrapper}>
                            <IconWithText
                                iconName='camera-outline'
                                customIcon={!image.uri == '' ? image : null}
                                onPress={() => setSelectionModalVisible(true)}
                                iconSize={image.uri == '' ? sizes.icons.xl : 80}
                                borderRadius={40}
                                tintColor={colors.white} />
                            <SelectionModal
                                isVisible={isSelectionModalVisible}
                                toggleModal={() => setSelectionModalVisible(false)}
                                onPressCamera={AddfromCamera}
                                onPressGallery={PickFromGalllary}
                            />
                        </RoundedWrapper>
                    </Wrapper> */}
                    <TextInputBordered
                        value={userName}
                        onChangeText={txt => {
                            setuserName(txt)
                            setUserNameError('')
                        }}
                        error={userNameError}
                        title='User Name'
                        iconName='person-outline'
                        placeholder='Enter your username' />
                    <Spacer height={sizes.baseMargin} />
                    <TextInputBordered
                        value={email}
                        onChangeText={txt => {
                            setEmail(txt)
                            setEmailError('')
                        }}
                        error={emailError}
                        title='Email'
                        iconName='mail-outline'
                        placeholder='Enter your email here' />
                    <Spacer height={sizes.baseMargin} />
                    <TextInputBordered
                        value={phone}
                        onChangeText={txt => {
                            setPhone(txt)
                            setPhoneError('')
                        }}
                        error={phoneError}
                        title='Phone Number'
                        iconName='call-outline'
                        keyboardType={'phone-pad'}
                        placeholder='Enter your phone' />
                    <Spacer height={sizes.baseMargin} />
                    <TextInputBorderedPassword
                        secureTextEntry={toggle}
                        value={password}
                        onChangeText={txt => {
                            setPassword(txt)
                            setPasswordError('')
                        }}
                        error={passwordError}
                        title='Password'
                        iconName='lock-closed-outline'
                        placeholder='Enter your Password'
                        right={<TouchableOpacity activeOpacity={.7} onPress={() => setToggle(!toggle)}
                            style={{ alignSelf: 'center' }}>
                            {toggle ? <Icon name='eye-outline' size={sizes.icons.large} color={colors.appTextColor5} />
                                : <Icon name='eye-off-outline' size={sizes.icons.large} color={colors.appTextColor5} />}
                        </TouchableOpacity>} />
                    <Spacer height={sizes.baseMargin} />
                    <TextInputBorderedPassword
                        value={confirmPassword}
                        onChangeText={txt => {
                            setConfirmPassword(txt)
                            setConfirmPasswordError('')
                        }}
                        error={confirmPasswordError}
                        secureTextEntry={toggle1}
                        title='Re-enter Password'
                        iconName='lock-closed-outline'
                        placeholder='Re-enter your password'
                        right={<TouchableOpacity activeOpacity={.7} onPress={() => setToggle1(!toggle1)}
                            style={{ alignSelf: 'center' }}>
                            {toggle1 ? <Icon name='eye-outline' size={sizes.icons.large} color={colors.appTextColor5} />
                                : <Icon name='eye-off-outline' size={sizes.icons.large} color={colors.appTextColor5} />}
                        </TouchableOpacity>} />
                    <Spacer height={sizes.baseMargin / 1.5} />
                    <Wrapper >
                        <TinyTitle style={appStyles.headingsTitle}>Account Type</TinyTitle>
                        <Spacer height={sizes.baseMargin / 1.5} />
                        <CheckBoxSelector onPress={(props) => setChecked(props)} checked={checked} />
                    </Wrapper>
                    <ComponentWrapper style={{ marginTop: sizes.doubleBaseMargin / 2 }}>
                        <CheckBoxPrimary text='I accept the company terms and conditions.' onPress={() => setAcceptLicense(!acceptLicense)} checked={acceptLicense} />
                    </ComponentWrapper>
                    <Wrapper style={{ marginVertical: sizes.marginVertical }}>
                        <ButtonColored
                            text={isLoading ? <ActivityIndicator color={colors.appColor8} /> : 'Sign Up'}
                            animation="fadeInUp"
                            buttonColor={colors.primary}
                            onPress={() => handlePressSignUp()} />
                        <LocationModal
                            isManualShown={shown}
                            isVisible={visible}
                            buttonText={['Enable', 'Enter Manual']}
                            secondButtonText='Continue'
                            onPressButtonManual={() => setShown(!shown)}
                            onPressBack={() => HandleBackPress()}
                            onPressButton={() => HandlePressContinue()}
                            onPressButtonLocation={() => requestLocationPermession()}
                            detail='We need to know your location.'
                            title='Enable Location' >
                        </LocationModal>
                    </Wrapper>
                    <RowWrapper style={{ justifyContent: 'center' }}>
                        <LargeText>Already have an account?  </LargeText>
                        <LargeText onPress={() => navigation.navigate(routes.signin)}
                            style={{ color: colors.primary, fontWeight: '700' }}>Sign In</LargeText>
                    </RowWrapper>
                    <Spacer height={sizes.doubleBaseMargin} />
                </KeyboardAvoidingScrollView>
            </Wrapper>
        </MainWrapper >
    )
}

export default Signup

const styles = StyleSheet.create({
    roundedWrapper: {
        marginVertical: sizes.baseMargin,
        height: sizes.cameraBgHeight,
        width: sizes.cameraBgWeidth,
        borderRadius: sizes.CamBgRadius,
        backgroundColor: colors.appBgColor3
    }
})