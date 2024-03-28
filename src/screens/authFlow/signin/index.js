import { View, Text, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { AppLogo1, ButtonColored, ButtonWithIcon, CheckBoxPrimary, ComponentWrapper, KeyboardAvoidingScrollView, LargeText, LargeTitle, MainWrapper, MediumText, RowWrapper, RowWrapperBasic, SmallText, Spacer, TextInputBordered, TextInputBorderedPassword, TinyText, TinyTitle, Wrapper, XXLTitle } from '../../../components'
import { height, totalSize } from 'react-native-dimension'
import { appImages, appStyles, colors, routes, sizes } from '../../../services'
import Icon from 'react-native-vector-icons/Ionicons';
import { signIn } from '../../../backend/auth'
import Validations from '../../../services/validations'
import { getAllOfCollection, getData, getDocByKeyValue, getFavoritesList } from '../../../backend/utility'
import { StackActions } from '@react-navigation/native';
import { useDispatch, } from 'react-redux';
import { addFavorites, all_jobs, signin } from '../../../redux/actions'
import SimpleToast from 'react-native-simple-toast'


const Signin = ({ navigation }) => {
    const { navigate } = navigation
    const dispatch = useDispatch()
    const [check, setCheck] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [toggle, setToggle] = useState(true);
    const popAction = StackActions.replace(routes.mainDrawer)


    const validations = () => {
        !email ? setEmailError('Please enter your email, it is a required field') : !Validations.validateEmail(email) ? setEmailError('Email format is invalid') : setEmailError('')
        !password ? setPasswordError('Please enter your password, it is a required field') : password.length < 6 ? setPasswordError('Password should be at least 6 characters long') : setPasswordError('')
        if (email && password.length >= 6 && Validations.validateEmail(email)) {
            return true
        } else {
            return false
        }
    }

    const HandleLogin = async () => {
        if (validations()) {
            setLoading(true)
            await signIn(email.trim(), password)
                .then(res => {
                    if (res.res != false) {
                        getData('Users', res)
                            .then(async user => {
                                dispatch(signin(user))
                                if (user?.userType == 'Applicant') {
                                    await getAllOfCollection('PostedJobs').then(res => {
                                        dispatch(all_jobs(res))
                                    })
                                } else {
                                    getDocByKeyValue('PostedJobs', 'user.user_id', user.user_id)
                                        .then(res => {
                                            dispatch(all_jobs(res))
                                        })
                                }
                                await getFavoritesList('Favorites', 'likes', user.user_id)
                                    .then(res => { dispatch(addFavorites(res)) })
                                setLoading(false)
                                navigation.dispatch(StackActions.replace(routes.mainDrawer, { type: user.userType }))
                            })
                            .catch(err => {
                                console.log('error', err)
                                setLoading(false)
                            })
                    }
                    else {
                        setLoading(false)
                        SimpleToast.show(res.error)
                    }
                })
                .catch(err => {
                    setLoading(false)
                    console.log('err    :', err)
                })
        }
    }
    return (
        <MainWrapper>
            <Wrapper flex={1}>
                <KeyboardAvoidingScrollView>
                    <Wrapper animation={'fadeInDown'}>
                        <Spacer height={sizes.baseMargin} />
                        <Wrapper style={appStyles.center}>
                            {/* <AppLogo1 height={totalSize(15)} width={totalSize(25)} source={appImages.logoIcon} /> */}
                            <AppLogo1 height={totalSize(15)} width={totalSize(25)} source={appImages.logo} />
                            <XXLTitle style={{ color: colors.primary }}>Welcome Back</XXLTitle>
                            {/* <TinyTitle style={{ color: colors.appTextColor5 }}>to asler the cleaning app</TinyTitle> */}
                        </Wrapper>
                        <Spacer height={sizes.doubleBaseMargin} />
                        <ComponentWrapper>
                            <LargeText style={{ color: colors.appTextColor4, alignSelf: "center" }}>Hello there, Sign in to continue!</LargeText>
                        </ComponentWrapper>
                    </Wrapper>
                    <Wrapper animation={'fadeInLeft'} >
                        <Spacer height={sizes.baseMargin} />
                        <TextInputBordered

                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                                setEmailError('')
                            }}
                            error={emailError}
                            title='Email'
                            iconName='mail-outline'
                            placeholder='Enter your email here' />
                        <Spacer height={sizes.baseMargin} />
                        <TextInputBorderedPassword
                            value={password}
                            onChangeText={txt => {
                                setPassword(txt)
                                setPasswordError('')
                            }}
                            error={passwordError}
                            secureTextEntry={toggle}
                            title='Password'
                            iconName='lock-closed-outline'
                            placeholder='Enter your Password'
                            right={<TouchableOpacity activeOpacity={.7} onPress={() => setToggle(!toggle)}
                                style={{ alignSelf: 'center' }}>
                                {toggle ? <Icon name='eye-outline' size={sizes.icons.large} color={colors.appTextColor5} />
                                    : <Icon name='eye-off-outline' size={sizes.icons.large} color={colors.appTextColor5} />}
                            </TouchableOpacity>} />
                        <RowWrapper style={{ paddingVertical: sizes.baseMargin / 2 }}>
                            <CheckBoxPrimary text='Remember me' onPress={() => setCheck(!check)} checked={check} />
                            <LargeText onPress={() => navigation.navigate(routes.forgotPassword)}
                                style={{ color: colors.primary }}>Forgot Password?</LargeText>
                        </RowWrapper>
                    </Wrapper>
                    <Wrapper animation={'fadeInUp'} style={{ marginVertical: sizes.marginVertical }}>
                        <ButtonColored
                            disabled={isLoading}
                            text={isLoading ? <ActivityIndicator color={colors.appBgColor1} /> : "Sign in"}

                            buttonColor={colors.primary}
                            onPress={HandleLogin} />
                        {/* onPress={() => navigation.navigate(routes.mainDrawer, { type: 'Event' })} /> */}
                        {/* onPress={() => navigation.navigate(routes.mainDrawer, { type: 'Applicant' })} /> */}
                        {/* onPress={() => navigation.navigate(routes.mainDrawer, { type: 'Resturant' })} /> */}
                    </Wrapper>
                    {/* <Wrapper animation="fadeInUp" style={[appStyles.center, { marginVertical: sizes.marginVertical / 2 }]}>
                        <MediumText style={{ color: colors.appTextColor4 }}>or continue with</MediumText>
                    </Wrapper> */}
                    {/* <Wrapper animation="fadeInUp" style={{ marginVertical: sizes.marginVertical }}>
                        <ButtonWithIcon text="Login with Facebook"
                            buttonColor={colors.white}
                            tintColor={colors.appTextColor2}
                            iconSource={appImages.facebookIcon}
                            onPress={() => navigation.navigate(routes.ratingAndReview)} />
                        <Spacer height={sizes.baseMargin} />
                        <ButtonWithIcon text="Login with Google"
                            buttonColor={colors.white}
                            tintColor={colors.appTextColor2}
                            iconSource={appImages.gogoleIcon}
                            onPress={() => navigation.navigate(routes.chats)}
                        />
                    </Wrapper> */}
                    <RowWrapper style={{ justifyContent: 'center' }}>
                        <LargeText>Don’t have an account? </LargeText>
                        <LargeText onPress={() => navigation.navigate(routes.signup)}
                            style={{ color: colors.primary, fontWeight: '700' }}>Sign Up</LargeText>
                    </RowWrapper>
                    <Spacer height={sizes.doubleBaseMargin} />
                </KeyboardAvoidingScrollView>
            </Wrapper>
        </MainWrapper >
    )
}

export default Signin