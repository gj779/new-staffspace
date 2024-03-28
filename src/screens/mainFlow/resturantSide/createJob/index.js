import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BorderedTextWithIcon, ButtonColored, ButtonSelectablePrimary, ComponentWrapper, DatePickerModal, IconWithText, KeyboardAvoidingScrollView, MainHeader, MainWrapper, MediumText, RegularText, RowWrapper, RowWrapperBasic, ShowToast, Spacer, TextInputBorderUpTitle, TinyTitle, Wrapper } from '../../../../components'
import { appImages, appStyles, colors, routes, sizes } from '../../../../services'
import { totalSize, width } from 'react-native-dimension'
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { getDocByKeyValue, saveData, uniqueID, uploadProfileImage } from '../../../../backend/utility'
import { all_jobs } from '../../../../redux/actions'

const CreateJob = (props) => {
    const { navigation, route } = props
    const user_redux = useSelector(state => state.user)
    const dispatch = useDispatch()
    var type = null
    if (route?.params?.type)
        type = route?.params?.type
    let isEvent = type === 'Event'

    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [openStartDate, setOpenStartDate] = useState(false)
    const [openStartTime, setOpenStartTime] = useState(false)
    const [openEndDate, setOpenEndDate] = useState(false)
    const [openEndTime, setOpenEndTime] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [image, setImage] = useState({ uri: '', fileName: '' })
    const [title, setTitle] = useState('')
    const [titleError, setTitleError] = useState('')
    const [address, setAddress] = useState('')
    const [addressError, setAddressError] = useState('')
    const [noOfJobs, setnoOfJobs] = useState('')
    const [noOfJobsError, setnoOfJobsError] = useState('')
    const [price, setPrice] = useState('')
    const [priceError, setPriceError] = useState('')
    const [selectedJob, setSelectedJob] = useState('Part Time')
    const PickPhotoFromGallery = async () => {
        try {
            const data = await ImagePicker.openPicker({
                width: 1080,
                height: 1080,
                cropping: true
            }).then(image => {
                console.log(image);
                setImage({ uri: image.path, fileName: uniqueID() })
            });
        } catch (e) {
            console.log(e)
        }
    }
    const validations = () => {
        !title ? setTitleError('title is required field') : setTitleError('')
        !address ? setAddressError('title is required field') : setAddressError('')
        !noOfJobs ? setnoOfJobsError('title is required field') : setnoOfJobsError('')
        !price ? setPriceError('title is required field') : setPriceError('')
        if (title && address && noOfJobs && price) {
            return true
        } else {
            return false
        }
    }
    const HandlePressCreateJob = async () => {
        if (validations()) {
            setLoading(true)
            let post = {
                post_id: uniqueID(),
                title: title,
                address: address,
                noOfJobs: noOfJobs,
                price: price,
                date: Date.parse(new Date(startDate)),
                isActive: true,
                JobType: selectedJob,
                applicants: [],
                favourites: [],
                createdAt: Date.parse(new Date()),
                user: {
                    user_id: user_redux.user_id,
                    username: user_redux.username,
                    userType: user_redux.userType,
                    profilePhoto: user_redux.profilePhoto,
                    description: user_redux.description,
                    phoneNo: user_redux.phoneNo,
                }
            }
            let eventPost = {
                post_id: uniqueID(),
                title: title,
                address: address,
                noOfJobs: noOfJobs,
                price: price,
                start_date: Date.parse(new Date(startDate)),
                start_time: Date.parse(new Date(startTime)),
                end_date: Date.parse(new Date(endDate)),
                end_time: Date.parse(new Date(endTime)),
                applicants: [],
                favourites: [],
                JobType: selectedJob,
                createdAt: Date.parse(new Date()),
                user: {
                    user_id: user_redux.user_id,
                    username: user_redux.username,
                    userType: user_redux.userType,
                    profilePhoto: user_redux.profilePhoto,
                    description: user_redux.description,
                    phoneNo: user_redux.phoneNo,
                }
            }
            if (image.uri) {
                await uploadProfileImage(image.uri, `${user_redux.userType}/postImages/${uniqueID()}${image.fileName}.png`)
                    .then(async res => {
                        isEvent ? eventPost.postImage = res : post.postImage = res
                        await saveData('PostedJobs', isEvent ? eventPost.post_id : post.post_id, isEvent ? eventPost : post).then(res => {
                            getDocByKeyValue('PostedJobs', 'user.user_id', user_redux.user_id)
                                .then(res => {
                                    dispatch(all_jobs(res))
                                    setLoading(false)
                                    navigation.navigate(routes.eventListing)
                                })
                                .catch(err => {
                                    setLoading(false)
                                    console.log('PostedJobs err :', err)
                                })
                        })
                            .catch(err => {
                                setLoading(false)
                                console.log('err :', err)
                            })
                    })
                    .catch(err => {
                        setLoading(false)
                        console.log('Image Error', err)
                    })
            }
            else {
                await uploadProfileImage(appImages.noImageAvailable, `${user_redux.userType}/postImages/${uniqueID()}_noImage.png`)
                    .then(async res => {
                        post.postImage = res
                        await saveData('PostedJobs', isEvent ? eventPost.post_id : post.post_id, isEvent ? eventPost : post).then(res => {
                            let message = 'sucess'
                            ShowToast(message)
                            getDocByKeyValue('PostedJobs', 'user.user_id', user_redux.user_id)
                                .then(res => {
                                    dispatch(all_jobs(res))
                                    setLoading(false)
                                    navigation.navigate(routes.eventListing)
                                })
                                .catch(err => {
                                    setLoading(false)
                                    console.log('PostedJobs err :', err)
                                })
                        })
                            .catch(err => {
                                setLoading(false)
                                console.log('err :', err)
                            })
                    })
                    .catch(err => {
                        setLoading(false)
                        console.log('Image Error', err)
                    })

            }
        }
    }
    const handleJobSelection = (id) => {
        switch (id) {
            case '1':
                setSelectedJob('Part Time')
                break;
            case '2':
                setSelectedJob('Full Time')
                break;
            default:
                break;
        }
    }
    return (
        <MainWrapper>
            <Wrapper flex={1} style={appStyles.mainContainer}>
                <MainHeader title={type == 'Resturant' ? 'Create Job' : 'Create Event'} buttonSize={totalSize(3)}
                    onPressBack={() => navigation.goBack()} />
                <KeyboardAvoidingScrollView>
                    <Spacer height={sizes.baseMargin} />
                    <ComponentWrapper>
                        <RegularText style={[styles.textInputTitle, styles.startMargin]}>Image</RegularText>
                    </ComponentWrapper>
                    <Spacer height={sizes.smallMargin} />
                    <BorderedTextWithIcon
                        customIcon={image.uri ? { uri: image?.uri } : null}
                        iconName='file-image-plus-outline'
                        iconType={'material-community'}
                        iconSize={sizes.icons.xl}
                        iconColor={colors.primary}
                        onPress={() => PickPhotoFromGallery()}
                        style={{ color: colors.primary, padding: 0 }} />
                    <TextInputBorderUpTitle
                        value={title}
                        error={titleError}
                        onChangeText={(txt => {
                            setTitle(txt)
                            setTitleError('')
                        })}
                        title={'Title'}
                        titleStyle={styles.textInputTitle} />
                    <TextInputBorderUpTitle
                        value={address}
                        error={addressError}
                        onChangeText={(txt => {
                            setAddress(txt)
                            setAddressError('')
                        })}
                        title={'Address'}
                        titleStyle={styles.textInputTitle}
                        left={<IconWithText iconName={'location-outline'} containerStyle={styles.TextInputLeftStyle} iconSize={sizes.icons.medium} />}
                    />
                    <Spacer height={sizes.smallMargin} />
                    <ComponentWrapper>
                        <RegularText style={[styles.textInputTitle, styles.startMargin]}>
                            {type !== 'Resturant' ? 'Event Date and Time' : 'Start Date'}
                        </RegularText>
                        <Spacer height={sizes.baseMargin} />
                        <RowWrapperBasic>
                            <DatePickerModal
                                onPress={() => setOpenStartDate(true)}
                                setOpen={openStartDate} setDate={startDate}
                                onCancel={() => { setOpenStartDate(false) }}
                                text={startDate}
                                onConfirm={(date) => {
                                    setOpenStartDate(false)
                                    setStartDate(date)
                                }}
                            />
                            {type !== 'Resturant' ? <DatePickerModal isTimeModal
                                onPress={() => setOpenStartTime(true)}
                                setOpen={openStartTime} setDate={startTime}
                                onCancel={() => { setOpenStartTime(false) }}
                                text={startTime}
                                onConfirm={(date) => {
                                    setOpenStartTime(false)
                                    setStartTime(date)
                                }}
                            /> : null}
                        </RowWrapperBasic>
                        <Spacer height={sizes.smallMargin} />
                        {type !== 'Resturant' ? <Wrapper>
                            <RegularText style={[styles.textInputTitle, styles.startMargin]}>Last Date and Time to Apply</RegularText>
                            <Spacer height={sizes.baseMargin} />
                            <RowWrapperBasic>
                                <DatePickerModal
                                    onPress={() => setOpenEndDate(true)}
                                    setOpen={openEndDate} setDate={endDate}
                                    onCancel={() => { setOpenEndDate(false) }}
                                    text={endDate}
                                    onConfirm={(date) => {
                                        setOpenEndDate(false)
                                        setEndDate(date)
                                    }}
                                />
                                <DatePickerModal isTimeModal
                                    onPress={() => setOpenEndTime(true)}
                                    setOpen={openEndTime} setDate={endTime}
                                    onCancel={() => { setOpenEndTime(false) }}
                                    text={endTime}
                                    onConfirm={(date) => {
                                        setOpenEndTime(false)
                                        setEndTime(date)
                                    }}
                                />
                            </RowWrapperBasic>
                        </Wrapper> : null
                        }
                    </ComponentWrapper>
                    <ComponentWrapper>
                        <RegularText style={[styles.textInputTitle, styles.startMargin]}>Job Type</RegularText>
                    </ComponentWrapper>
                    <Spacer height={sizes.smallMargin} />
                    <RowWrapper style={styles.availabilityWrapper}>
                        <Wrapper flex={1}>
                            <ButtonSelectablePrimary
                                text={'Part Time'}
                                isSelected={selectedJob == 'Part Time'}
                                onPress={() => handleJobSelection('1')} />
                        </Wrapper>
                        <Wrapper flex={1}>
                            <ButtonSelectablePrimary
                                text={'Full Time'}
                                isSelected={selectedJob == 'Full Time'}
                                onPress={() => handleJobSelection('2')} />
                        </Wrapper>
                    </RowWrapper>
                    <TextInputBorderUpTitle
                        value={noOfJobs}
                        error={noOfJobsError}
                        onChangeText={txt => {
                            setnoOfJobs(txt)
                            setnoOfJobsError('')
                        }}
                        title={'Total Number of Jobs'}
                        titleStyle={styles.textInputTitle} />
                    <TextInputBorderUpTitle
                        value={price}
                        error={priceError}
                        onChangeText={txt => {
                            setPrice(txt)
                            setPriceError('')
                        }}
                        title={'Price / hr'}
                        titleStyle={styles.textInputTitle}
                        right={<RegularText style={styles.textInputRight}>/Hour</RegularText>} />
                    <Spacer height={sizes.doubleBaseMargin} />
                    <ButtonColored
                        disabled={isLoading}
                        text={isLoading ? <ActivityIndicator color={colors.appBgColor1} /> : 'Create'}
                        buttonColor={colors.primary}
                        onPress={HandlePressCreateJob} />
                    <Spacer height={sizes.doubleBaseMargin} />
                </KeyboardAvoidingScrollView>
            </Wrapper>
        </MainWrapper>
    )
}

export default CreateJob
const styles = StyleSheet.create({
    textInputTitle: {
        fontSize: totalSize(2),
        color: colors.black
    },
    textInputRight: {
        marginEnd: 10
    },
    TextInputLeftStyle: {
        marginStart: 8,
        marginEnd: -15
    },
    startMargin: {
        marginStart: 10
    },
    availabilityWrapper: {
        alignSelf: "center"
    },
    availabilityButton: {
        paddingHorizontal: width(12)
    },
})