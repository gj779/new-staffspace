import { StackActions } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { height, totalSize, width } from 'react-native-dimension'
import { useDispatch } from 'react-redux'
import { getCurrentUserId } from '../../../backend/auth'
import { getAllOfCollection, getData, getDocByKeyValue, getFavoritesList } from '../../../backend/utility'
import { AppLogo1, ButtonBordered, ButtonColored, ComponentWrapper, CustomizedImage, LoaderPrimary } from '../../../components'
import SplashBackground from '../../../components/splashBackground'
import { TinyTitle, XXLTitle } from '../../../components/text'
import { ImageBackgroundWrapper, MainWrapper, Wrapper } from '../../../components/wrappers'
import { addFavorites, all_jobs, signin } from '../../../redux/actions'
import { appImages, appStyles, colors, routes } from '../../../services'

const Splash = ({ navigation }) => {
    return (
        <MainWrapper >
            {/* <ImageBackgroundWrapper
                source={require('../../../assets/images/splash-background.jpg')}> */}
            <SplashBackground>
                <Wrapper style={[appStyles.center]}>
                    <XXLTitle>Welcome</XXLTitle>
                    <AppLogo1 height={totalSize(15)} width={totalSize(25)} source={appImages.logo} />
                </Wrapper>
                <Wrapper style={{ marginTop: 50 }}>
                    <ButtonColored text='Get Started'
                        buttonColor={colors.primary}
                        buttonStyle={{ width: width(80) }}
                        onPress={() => navigation.replace('splashLoading')} />
                </Wrapper>
            </SplashBackground>
            {/* </ImageBackgroundWrapper> */}
        </MainWrapper>
    )
}
export default Splash

export const SplashLoader = ({ navigation }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        let token = getCurrentUserId()
        if (token) {
            getData('Users', token)
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

                    navigation.dispatch(StackActions.replace(routes.mainDrawer, { type: user.userType }))
                })
        }
        else {
            navigation.replace('signin')
        }
        // setTimeout(() => {
        //     navigation.replace('signin')
        // }, 500);
    }, [])
    return (
        <MainWrapper >
            <ComponentWrapper flex={1}>
                <Wrapper style={[appStyles.center, { marginVertical: height(15) }]}>
                    <Wrapper>
                        <AppLogo1 height={totalSize(20)} width={totalSize(25)} source={appImages.logo} />
                        <LoaderPrimary />
                    </Wrapper>
                </Wrapper>
            </ComponentWrapper>
        </MainWrapper >
    )
}