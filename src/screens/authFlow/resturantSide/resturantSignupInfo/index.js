import { View, Text, StyleSheet, PermissionsAndroid, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { AppLogo1, ButtonBordered, ButtonColored, ComponentWrapper, CustomizedImage, KeyboardAvoidingScrollView, MainWrapper, RegularText, RenderImages, RowWrapper, SmallText, Spacer, TextInputBordered, TextInputSimpleBordered, Wrapper } from '../../../../components'
import { appImages, appStyles, colors, routes, sizes, takePhotoFromCamera } from '../../../../services'
import { height, totalSize, width } from 'react-native-dimension'
import ImagePicker from 'react-native-image-crop-picker';
import { saveData, uniqueID, uploadProfileImage } from '../../../../backend/utility'
import { signUp } from '../../../../backend/auth'

const ResturantSignupInfo = ({ navigation, route }) => {
    const { USER, image } = route.params
    const [country, setCountry] = useState('')
    const [countryError, setCountryError] = useState('')
    const [state, setState] = useState('')
    const [stateError, setStateError] = useState('')
    const [city, setCity] = useState('')
    const [cityError, setCityError] = useState('')
    const [description, setDescription] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [uid, setUserId] = useState('')

    const [images, setImages] = useState([{ id: '1' },])

    const AddImages = async () => {
        try {
            const image = await takePhotoFromCamera()
            if (image) {
                setImages([{ id: uniqueID(), uri: image.path }, ...images,])
            }
        } catch (error) {
            console.log(error)
        }
    }
    const validations = () => {
        !country ? setCountryError('* Country') : setCountryError('')
        !state ? setStateError('* State') : setStateError('')
        !city ? setCityError('* City') : setCityError('')
        !description ? setDescriptionError('* Description') : setDescriptionError('')
        if (country && state && city && description) {
            return true
        } else {
            return false
        }
    }
    const HandleSignUp = async () => {
        let user = {
            ...USER,
            country: country,
            state: state,
            city: city,
            description: description,
            photos: [],
            profilePhoto: ''
        }
        if (validations()) {
            setLoading(true)
            signUp(user).then(async res => {
                user.user_id = res.user.uid
                const photos = images.filter((image) => image.id != '1')
                let tempPhotos = []
                let tempProfile = ''
                if (image.uri) {
                    tempProfile = await uploadProfileImage(image.uri, `${user.userType}/Images/profileImages/${uniqueID()}${image.fileName}`)
                }
                else {
                    tempProfile = await uploadProfileImage(appImages.noUser, `${user.userType}/Images/profileImages/${uniqueID()}_random.png`)
                }
                console.log(photos)
                await Promise.all(
                    photos.map(async photo => {
                        const tPhoto = await uploadProfileImage(photo.uri, `${user.userType}/Images/Photos/${photo.id}`)
                        console.log(tPhoto)
                        tempPhotos.push({ id: uniqueID(), uri: tPhoto })
                    })
                ).then(() => {
                    if (tempProfile) {
                        user.profilePhoto = tempProfile
                    }
                    if (tempPhotos.uri) {
                        user.photos = tempPhotos
                    }
                    delete user.password
                    console.log('user   :', user)
                    saveData('Users', user.user_id, user).then(res => {
                        navigation.navigate(routes.signin)
                        setLoading(false)
                    }).catch(err => {
                        console.log('saveData Err', err)
                        setLoading(false)
                    })
                }).catch(err => {
                    console.log('promise ', err)
                    setLoading(false)
                })
            }).catch((err) => {
                console.log('userError :', err)
                setLoading(false)
            })
        } else {
            console.log('fill data')
            setLoading(false)
        }
    }
    return (
        <MainWrapper>
            <Wrapper flex={1} style={appStyles.mainContainer}>
                <KeyboardAvoidingScrollView>
                    <Spacer height={sizes.doubleBaseMargin} />
                    <Wrapper style={appStyles.center}>
                        <AppLogo1 height={totalSize(15)} width={totalSize(25)} source={appImages.logoIcon} />
                    </Wrapper>
                    <ComponentWrapper>
                        <RegularText style={styles.detailTxt}>* Country</RegularText>
                    </ComponentWrapper>
                    <TextInputSimpleBordered
                        value={country}
                        onChangeText={txt => {
                            setCountry(txt)
                            setCountryError('')
                        }}
                        error={countryError}
                        placeholder='Country'
                        inputStyle={styles.inputText} />
                    <Spacer height={sizes.TinyMargin} />
                    <ComponentWrapper>
                        <RegularText style={styles.detailTxt}>* State</RegularText>
                    </ComponentWrapper>
                    <TextInputSimpleBordered
                        value={state}
                        onChangeText={txt => {
                            setState(txt)
                            setStateError('')
                        }}
                        error={stateError}
                        placeholder='State'
                        inputStyle={styles.inputText} />
                    <Spacer height={sizes.TinyMargin} />
                    <ComponentWrapper>
                        <RegularText style={styles.detailTxt}>* City</RegularText>
                    </ComponentWrapper>
                    <TextInputSimpleBordered
                        value={city}
                        onChangeText={txt => {
                            setCity(txt)
                            setCityError('')
                        }}
                        error={cityError}
                        placeholder='City'
                        inputStyle={styles.inputText} />
                    <Spacer height={sizes.TinyMargin} />
                    <ComponentWrapper>
                        <RegularText style={styles.detailTxt}>Description</RegularText>
                    </ComponentWrapper>
                    <Spacer height={sizes.smallMargin} />
                    <TextInputBordered
                        value={description}
                        onChangeText={txt => {
                            setDescription(txt)
                            setDescriptionError('')
                        }}
                        containerStyle={styles.textInputBorderedContainer}
                        inputStyle={styles.textInputComments}
                        multiline
                        iconColor={colors.primary}
                        error={descriptionError}
                        iconSize={sizes.icons.large} />
                    <ComponentWrapper style={appStyles.right}>
                        <Spacer height={sizes.TinyMargin} />
                        <SmallText style={styles.detailTxt}>{description.length} to 250</SmallText>
                    </ComponentWrapper>
                    <Spacer height={sizes.baseMargin} />
                    <ComponentWrapper>
                        <RegularText style={styles.detailTxt}>Add images</RegularText>
                    </ComponentWrapper>
                    <Spacer height={sizes.baseMargin} />
                    <ComponentWrapper>
                        <RenderImages data={images} onPress={AddImages} />
                    </ComponentWrapper>
                    <Spacer height={sizes.doubleBaseMargin} />
                    <ButtonColored
                        disabled={isLoading}
                        text={isLoading ? <ActivityIndicator color={colors.appColor8} /> : 'Continue'}
                        buttonColor={colors.primary}
                        onPress={HandleSignUp} />
                    <Spacer height={sizes.doubleBaseMargin} />
                </KeyboardAvoidingScrollView>
            </Wrapper>
        </MainWrapper>
    )
}

export default ResturantSignupInfo

const styles = StyleSheet.create({
    availabilityButton: {
        paddingHorizontal: width(8)
    },
    availabilityWrapper: {
        alignSelf: "center"
    },
    inputText: {
        paddingHorizontal: width(3),
        marginVertical: sizes.smallMargin / 1.5,
        borderColor: colors.primary
    },
    detailTxt: {
        color: colors.appTextColor5
    },
    textInputComments: {
        height: height(20),
        color: colors.primary,
        textAlignVertical: 'top',
    },
    textInputBorderedContainer: {
        borderColor: colors.primary
    },
}) 