import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { AppLogo1, BorderedTextWithIcon, ButtonColored, ComponentWrapper, KeyboardAvoidingScrollView, MainWrapper, RegularText, RowWrapper, RowWrapperBasic, SmallText, Spacer, TextInputBordered, TextInputSimpleBordered, TinyText, Wrapper } from '../../../components'
import { height, totalSize, width } from 'react-native-dimension'
import { appImages, appStyles, colors, routes, sizes } from '../../../services'
import DocumentPicker, { types } from 'react-native-document-picker';
import { signUp } from '../../../backend/auth'
import { saveData, uniqueID, uploadProfileImage } from '../../../backend/utility'

const PreviousJobDetail = ({ navigation, route }) => {
    const { USER, image } = route.params

    const [city, setCity] = useState('')
    const [year, setYear] = useState('')
    const [previousJobDetail, setPreviousJobDetails] = useState('')
    const [description, setDescription] = useState('')
    const [uid, setUserId] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [fileResponse, setFileResponse] = useState([]);

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                type: [types.pdf, types.docx]
            });
            setFileResponse(response);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const validations = () => {
        if (city && year && description) {
            return true
        } else {
            return false
        }
    }

    const HandleSignUp = async () => {
        try {
            let User = {
                ...USER,
                selectionCity: city,
                selectionDate: year,
                previousJobDetail: previousJobDetail,
                description: description,
            }
            if (validations()) {
                setLoading(true)
                await signUp(User).then(async res => {
                    User.user_id = res.user.uid
                    let profileImage = false
                    let temDoc = false
                    if (image?.uri) {
                        profileImage = await uploadProfileImage(image.uri, `${User.userType}/Images/profiles/${uniqueID()}${image.fileName}`)
                        console.log(profileImage)
                    }
                    else {
                        profileImage = await uploadProfileImage(appImages.noUser, `${User.userType}/Images/Profiles/${uniqueID()}_random.png`)
                    }
                    await Promise.all(
                        fileResponse.map(async i => {
                            temDoc = await uploadProfileImage(i.uri, `${User.userType}/Documents/${uniqueID()}${i.name}`)
                        })
                    ).then(() => {
                        if (profileImage) {
                            User.profilePhoto = profileImage
                        }
                        if (temDoc) {
                            User.resume = temDoc
                        }
                        delete User.password
                        saveData('Users', User.user_id, User).then(res => {
                            setLoading(false)
                            navigation.navigate(routes.signin)
                        }).catch(err => {
                            console.log('err :', err)
                            setLoading(false)
                        })
                    })
                }).catch((err) => {
                    console.log(err)
                    setLoading(false)
                })
            }
            else {
                setLoading(false)
            }
        } catch { setLoading(false) }
    }
    return (
        <MainWrapper>
            <Wrapper flex={1} animation="fadeInUp">
                <KeyboardAvoidingScrollView>
                    <Spacer height={sizes.doubleBaseMargin} />
                    <Wrapper style={appStyles.center}>
                        <AppLogo1 height={totalSize(15)} width={totalSize(25)} source={appImages.logoIcon} />
                    </Wrapper>
                    <Spacer height={sizes.smallMargin} />
                    <RowWrapper>
                        <RegularText style={styles.detailTxt}>* Selection City</RegularText>
                        <RegularText style={styles.detailTxt}>Selection Date</RegularText>
                    </RowWrapper>
                    <Spacer height={sizes.smallMargin} />
                    <RowWrapper style={appStyles.center}>
                        <TextInputSimpleBordered
                            value={city}
                            onChangeText={txt => setCity(txt)}
                            placeholder='city'
                            inputStyle={styles.inputTextRow} />
                        <TextInputSimpleBordered
                            value={year}
                            onChangeText={txt => setYear(txt)}
                            placeholder='year'
                            inputStyle={styles.inputTextRow} />
                    </RowWrapper>
                    <Spacer height={sizes.baseMargin} />
                    <RowWrapper>
                        <RegularText style={styles.detailTxt}>* Previous Job details</RegularText>
                        <RegularText style={styles.detailTxt}>Optional*</RegularText>
                    </RowWrapper>
                    <Spacer height={sizes.smallMargin} />
                    <TextInputSimpleBordered
                        value={previousJobDetail}
                        onChangeText={txt => setPreviousJobDetails(txt)} />
                    <Spacer height={sizes.smallMargin} />
                    <ComponentWrapper>
                        <RegularText style={styles.descriptionColor}>Description</RegularText>
                    </ComponentWrapper>
                    <Spacer height={sizes.baseMargin} />
                    <TextInputSimpleBordered value={description}
                        onChangeText={txt => setDescription(txt)}
                        multiline={true}
                        inputStyle={styles.inputTextmultiline} />
                    <ComponentWrapper style={appStyles.right}>
                        <Spacer height={sizes.TinyMargin} />
                        <SmallText style={styles.descriptionColor}>{description?.length} to 250</SmallText>
                    </ComponentWrapper>
                    <ComponentWrapper style={{ marginVertical: sizes.smallMargin }}>
                        <RegularText style={styles.descriptionColor}>Uplaod Resume</RegularText>
                    </ComponentWrapper>
                    <BorderedTextWithIcon
                        text={fileResponse != [] ? fileResponse?.map(i => i.name) : 'Browse file'}
                        iconName='cloud-upload-outline'
                        iconSize={sizes.icons.large}
                        iconColor={colors.primary}
                        onPress={() => handleDocumentSelection()}
                        style={{ color: colors.primary }} />
                    <Spacer height={sizes.doubleBaseMargin * 2.5} />
                    <ButtonColored buttonColor={colors.primary}
                        disabled={isLoading}
                        text={isLoading ? <ActivityIndicator color={colors.appColor8} /> : 'Continue'}
                        onPress={HandleSignUp} />
                    <Spacer height={sizes.baseMargin * 1.5} />
                </KeyboardAvoidingScrollView>
            </Wrapper>
        </MainWrapper>
    )
}
export default PreviousJobDetail

const styles = StyleSheet.create({
    availabilityButton: {
        paddingHorizontal: width(8)
    },
    availabilityWrapper: {
        alignSelf: "center"
    },
    inputTextRow: {
        width: width(40),
    },
    inputTextmultiline: {
        height: height(10),
        textAlignVertical: 'top',
    },
    detailTxt: {
        color: colors.appTextColor5
    },
    descriptionColor: {
        color: colors.appTextColor5
    }
}) 