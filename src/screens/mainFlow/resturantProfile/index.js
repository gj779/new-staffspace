import { View, Text, StyleSheet, Linking, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AbsoluteWrapper, BackArrowButton, BackArrowSquaredButton, ButtonColored, CheckBoxFavorite, ComponentWrapper, DatePickerModal, FeedImage, IconWithText, ImageProfile, ImageSqareRound, KeyboardAvoidingScrollView, LargeText, MainWrapper, RegularText, RenderReviewCard, ResturantFeedApplicants, ReviewsCard, RowWrapper, RowWrapperBasic, SmallText, SmallTitle, Spacer, TextwithDescription, TinyTitle, Wrapper, ButtonTextMedium } from '../../../components'
import { appImages, appStyles, colors, HandleFavourites, IsLiked, routes, sizes, SortAlphabets } from '../../../services'
import { height, totalSize, width } from 'react-native-dimension'
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, addToArray, getAllFriends, getData, getDocByKeyValue, saveData, saveNotification, uniqueID } from '../../../backend/utility'
import SimpleToast from 'react-native-simple-toast'
import { all_jobs } from '../../../redux/actions'
import moment from 'moment';

const ResturantProfile = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const { item, idx } = route?.params
    var isMyJobs = ''
    if (route?.params?.isMyJobs)
        isMyJobs = route?.params?.isMyJobs

    const user_redux = useSelector(state => state.user)
    const jobs_redux = useSelector(state => state?.allJobs)
    const isEvent = user_redux?.userType == 'Event'
    const [response, setResponse] = useState(false)
    const [user, setUser] = useState(user_redux)
    const [isLoading, setLoading] = useState(false)
    const [sortedId, setSortedId] = useState('')
    const [alljobs, setAllJobs] = useState(jobs_redux)
    const [job, setJob] = useState(item)

    useEffect(() => {
        setUser(user_redux)
    }, [user_redux])

    useEffect(() => {
        setAllJobs(jobs_redux)
    }, [jobs_redux])

    var isResturant = user?.userType == 'Resturant' || user?.userType == 'Event'

    const { navigate } = navigation
    const [reviewItems, setReviewItems] = useState('')
    const [items, setItems] = useState('')
    const [applicatns, setApplicatns] = useState(item?.applicants)
    let price = item?.price || items[0]?.price
    // console.log(JSON.stringify(items));
    // console.log(JSON.stringify(item));
    // console.log(moment(item?.createdAt).format('MM/DD/YYYY'));
    useEffect(() => {
        GenerateRoomId()
        if (isMyJobs === true) {
            getDocByKeyValue('PostedJobs', "post_id", item.post_id)
                .then(res => {
                    setItems(res)
                })
        }
        else {
            getDocByKeyValue('Reviews', 'post_id', item.post_id)
                .then(res => setReviewItems(res))
        }
    }, [])
    const HandleApply = async () => {
        let id = uniqueID()
        let Data = {
            _id: id,
            post_id: item.post_id,
            post_image: item.postImage,
            post_title: item.title,
            postedBy: item.user,
            applied_by: {
                user_id: user_redux.user_id,
                profilePhoto: user_redux.profilePhoto,
                username: user_redux.username,
                address: user_redux.location,
                description: user_redux.description,
                jobType: user_redux.jobType,
            },
            status: 'pending',
        }
        let data = {
            user_id: user_redux.user_id,
            profilePhoto: user_redux.profilePhoto
        }
        let tempResponse = ''
        let notificationFor = {
            _id: id,
            id: item?.user?.user_id,
            image: user_redux.profilePhoto,
            createdAt: Date.parse(new Date()),
            note: user_redux.username + " has applied for your " + item?.title + (item?.user?.userType === "Resturant" ? " Restaurant" : " Event")
        }
        let notificationSelf = {
            _id: id,
            id: user_redux.user_id,
            image: item?.user.profilePhoto,
            createdAt: Date.parse(new Date()),
            note: "Successfully applied for " + item?.title + (item?.user?.userType === "Resturant" ? " Restaurant" : " Event")
        }
        if (!response) {
            setLoading(true)
            await getDocByKeyValue('AppliedJobs', 'post_id', item.post_id)
                .then(async res => {
                    let tems = []
                    await res.map(d => {
                        tems = d.applied_by
                    })
                    tempResponse = await tems.user_id == user_redux.user_id
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
            if (tempResponse) {
                setLoading(false)
                SimpleToast.show('You have already applied for this job')
                setResponse(true)
            }
            else {
                saveData('AppliedJobs', id, Data)
                    .then(res => addToArray('PostedJobs', Data.post_id, 'applicants', data)
                        .then(res => {
                            SimpleToast.show('Successfully applied for job')
                            addNotification(notificationFor?.id, notificationFor?._id, notificationFor?.image, notificationFor?.note, notificationFor?.createdAt)
                                .then(res => {
                                    addNotification(notificationSelf?.id, notificationSelf?._id, notificationSelf?.image, notificationSelf?.note, notificationSelf?.createdAt)
                                        .then(res => {
                                            console.log('Successfully Added Notification')
                                            setLoading(false)
                                        })
                                        .catch(err => {
                                            console.log('Add Notification Error :', err)
                                            setLoading(false)
                                        })
                                })
                                .catch(err => {
                                    console.log('Add Notification Error :', err)
                                    setLoading(false)
                                })
                        })
                        .catch(err => {
                            console.log('saveData Error :', err)
                            setLoading(false)
                        }))
                    .catch(err => {
                        console.log('addToArray Error :', err)
                        setLoading(false)
                    })
            }
        }
        else {
            setLoading(false)
            SimpleToast.show('You have already applied for this job')
        }
    }
    const GenerateRoomId = () => {
        let roomID = item.user_id + user.user_id
        let roomIdSorted = SortAlphabets(roomID)
        setSortedId(roomIdSorted)
    }
    const HandleIsLiked = () => {
        let alltempPosts = [...alljobs]
        HandleFavourites(job, idx, alltempPosts, setAllJobs, dispatch, all_jobs, setJob)
    }
    return (
        <MainWrapper>
            <Wrapper flex={1} style={appStyles.mainContainer}>
                <KeyboardAvoidingScrollView>
                    <FeedImage source={{ uri: isMyJobs ? item?.post_image : item?.postImage }} height={height(22)}>
                        <Spacer height={sizes.smallMargin} />
                        <RowWrapper>
                            <BackArrowSquaredButton
                                size={totalSize(3)}
                                onPress={() => navigation.goBack()} />
                            {!isResturant ?
                                <CheckBoxFavorite
                                    onPress={HandleIsLiked}
                                    checked={IsLiked(job)} />
                                : <Wrapper style={[appStyles.center, styles.statusContainer, {
                                    backgroundColor:
                                        isEvent ? item?.start_date > Date.parse(new Date()) < item?.end_date ? colors.appColor11 : colors.appColor10
                                            : item.isActive ? colors.appColor11 : colors.appColor10
                                }]}>
                                    <RegularText style={{ color: colors.appTextColor6 }}>{
                                        isEvent ? item?.start_date > Date.parse(new Date()) < item?.end_date ? 'Active' : 'Inactive'
                                            : item?.isActive ? 'Active' : 'Inactive'}</RegularText>
                                </Wrapper>}
                        </RowWrapper>
                        {!isResturant ? <Wrapper style={styles.ratingWrapper} >
                            {reviewItems.length > 0 ? <Wrapper style={styles.ratingWrapperInner}>
                                <RowWrapperBasic style={styles.ratingRowWrapper}>
                                    <RegularText style={{ color: colors.appBgColor }}>{item?.ratings}</RegularText>
                                    <Spacer width={sizes.smallMargin} />
                                    <IconWithText
                                        iconSize={sizes.icons.tiny}
                                        iconName='star'
                                        tintColor={colors.appBgColor} />
                                </RowWrapperBasic>
                            </Wrapper> : null}
                        </Wrapper> : null}
                    </FeedImage>
                    <Wrapper style={{ width: width(100) }}>
                        <Wrapper style={[appStyles.center, styles.profileImageWrapper]}>
                            <ImageSqareRound size={width(21)} source={{ uri: isMyJobs ? item?.postedBy?.profilePhoto : item?.user?.profilePhoto }} />
                        </Wrapper>
                        {isMyJobs ? <AbsoluteWrapper style={{ top: 10, right: 10 }}>
                            <Wrapper style={[styles.absoluteWrapper,
                            { backgroundColor: item.status == 'pending' ? colors.appButton9 : item.status == 'rejected' ? colors.appButton5 : colors.appButton8 }]}>
                                <RegularText style={{ color: colors.appTextColor6 }}>
                                    {item.status == 'pending' ? 'Pending' : item.status !== 'rejected' ? 'Approved' : 'Rejected'}
                                </RegularText>
                            </Wrapper>
                        </AbsoluteWrapper> : null}
                    </Wrapper>
                    <ComponentWrapper>
                        <Wrapper style={appStyles.center}>
                            <SmallTitle>{isMyJobs ? item?.post_title : item.title}</SmallTitle>
                        </Wrapper>
                        <Spacer height={sizes.baseMargin} />
                        {isResturant ?
                            applicatns.length > 0 ? <TouchableOpacity activeOpacity={.95} style={{ height: 40 }}
                                onPress={() => { }}>
                                <AbsoluteWrapper >
                                    <Wrapper style={[appStyles.shadow, styles.applicantsWrapper]}>
                                        <ResturantFeedApplicants
                                            onPressAll={() => navigate(routes.applicants, { postId: item.post_id })}
                                            data={applicatns} onPress={(props) => navigate(routes.myProfile, { Data: props, isResturant: true })} />
                                    </Wrapper>
                                </AbsoluteWrapper>
                            </TouchableOpacity> : null
                            : null}
                        <TextwithDescription title='Description'
                            text={item?.user?.description ? item?.user?.description : items[0]?.user?.description ? items[0]?.user?.description
                                : 'Sea Resturant fast and sea food our menue and get good jobs according to your resume Sea Resturant fast and sea food our menue and get good jobs according to your resume'} />
                        <TextwithDescription title='Category' text='Chef' />
                        <TextwithDescription title='Job type' text={item?.JobType ? item?.JobType : 'Full Time'} />
                        <TextwithDescription title={isResturant ? 'Positions available' : 'Number of Personals needed'} text={isMyJobs ? items[0]?.noOfJobs : item?.noOfJobs} />
                        <TinyTitle>Address</TinyTitle>
                        <Spacer height={sizes?.smallMargin} />
                        <IconWithText text={isMyJobs ? items[0]?.address : item?.address} iconName='location-outline' tintColor={colors.appTextColor3} />
                        <Spacer height={sizes?.baseMargin} />
                        <TinyTitle>Phone Number</TinyTitle>
                        <Spacer height={sizes.smallMargin} />
                        {/* <IconWithText text={item?.user?.phoneNo} iconName='call' tintColor={colors.appTextColor3}
                            onPress={() => Linking.openURL(`tel:` + `${item?.user?.phoneNo}`)} /> */}
                        <IconWithText text={items?.postedBy?.phoneNo || item?.user?.phoneNo || items[0]?.user?.phoneNo || 'N/A'} iconName='call' tintColor={colors.appTextColor3}
                            onPress={() => Linking.openURL(`tel:` + `${items?.postedBy?.phoneNo || item?.user?.phoneNo || items[0]?.user?.phoneNo}`)} />
                        <Spacer height={sizes.baseMargin} />
                        {item?.user?.userType == 'Event' || items[0]?.user?.userType == 'Event' ? <Wrapper>
                            <TinyTitle>Event Date and Time</TinyTitle>
                            <Spacer height={sizes?.smallMargin} />
                            <RowWrapperBasic>
                                <DatePickerModal notPicker
                                    text={item?.start_date || items[0]?.start_date}
                                />
                                <DatePickerModal isTimeModal notPicker
                                    text={item?.start_date || items[0]?.start_date}
                                />
                            </RowWrapperBasic>
                            <Spacer height={sizes?.baseMargin} />
                            <TinyTitle>Last Date and Time to Apply</TinyTitle>
                            <Spacer height={sizes.smallMargin} />
                            <RowWrapperBasic>
                                <DatePickerModal notPicker
                                    text={item?.end_date || items[0]?.end_date}
                                />
                                <DatePickerModal isTimeModal notPicker
                                    text={item?.end_date || items[0]?.end_date}
                                />
                            </RowWrapperBasic>
                            <Spacer height={sizes?.baseMargin} />

                            <TinyTitle>Salary</TinyTitle>
                            <Spacer height={sizes.smallMargin} />
                            <RowWrapperBasic>
                                <Wrapper style={{ backgroundColor: colors.primary, padding: 10, width: width(18), borderRadius: 5, alignItems: 'center' }}>
                                    <ButtonTextMedium children={'Hour'} style={{ color: colors.white }} />
                                </Wrapper>

                                <Wrapper style={{ backgroundColor: colors.appBgColor6, padding: 10, width: width(18), borderRadius: 5, marginLeft: 20, alignItems: 'center' }}>
                                    <ButtonTextMedium children={'Job'} style={{ color: colors.black }} />
                                </Wrapper>
                                <ButtonTextMedium children={price + "$"} style={{ color: colors.black, marginLeft: 40 }} />
                            </RowWrapperBasic>

                            {reviewItems.length > 0 ? <Spacer height={sizes?.baseMargin} /> : <Spacer height={sizes?.headerHeight} />}
                        </Wrapper> : reviewItems.length > 0 ? <Spacer height={sizes?.baseMargin} /> : <Spacer height={sizes?.headerHeight} />
                        }
                        {reviewItems.length > 0 ? <Wrapper>
                            <RowWrapper style={{ marginStart: 0 }}>
                                <TinyTitle>Ratings and Reviews</TinyTitle>
                                <SmallText onPress={() => navigate(routes.ratingAndReview, { type: 'Resturant' })}
                                    style={styles.smallText}>See All +</SmallText>
                            </RowWrapper>
                            <Spacer height={sizes.baseMargin} />
                            <RenderReviewCard data={reviewItems} style={{ marginStart: 0 }} />
                            <Spacer height={sizes?.headerHeight} />
                        </Wrapper> : null}

                    </ComponentWrapper>

                    <Spacer height={sizes.baseMargin} />
                </KeyboardAvoidingScrollView>
            </Wrapper>
            {!isResturant ? <AbsoluteWrapper style={{ bottom: 10, left: 10, right: 10 }}>
                <RowWrapper style={styles.filterButtonWrapper}>
                    <Wrapper flex={1}>
                        <ButtonColored
                            text={item.status == 'approved' ? 'Rate us' : isLoading ? <ActivityIndicator color={colors.appTextColor6} /> : isMyJobs ? item.status !== 'approved' ? 'Applied' : 'Apply' : 'Apply'}
                            buttonColor={colors.primary}
                            buttonStyle={styles.filterButton}
                            disabled={isMyJobs ? item.status !== 'approved' ? isMyJobs : false : null}
                            onPress={() => {
                                item.status == 'approved' ? navigate('myJobReviews', { item: item })
                                    : HandleApply()
                            }} />
                    </Wrapper>
                    <Wrapper flex={1}>
                        <ButtonColored text='Message'
                            buttonColor={colors.appBgColor5}
                            tintColor={colors.white}
                            buttonStyle={styles.filterButton}
                            // onPress={() => {console.log(item?.user||items[0]?.user);console.log(sortedId)}}
                            onPress={() => navigation.navigate(routes.chatScreen, { receiver: item?.user || items[0]?.user, roomId: sortedId })}
                        />
                    </Wrapper>
                </RowWrapper>

            </AbsoluteWrapper> : null}
        </MainWrapper>
    )
}

export default ResturantProfile

const styles = StyleSheet.create({
    ratingWrapper: {
        position: 'absolute',
        bottom: height(1),
        right: 0
    },
    ratingWrapperInner: {
        alignSelf: 'flex-end',
        marginEnd: width(3)
    },
    ratingRowWrapper: {
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: sizes.ModalRadius,
    },
    profileImageWrapper: {
        marginTop: -30,
        backgroundColor: colors.appBgColor,
        height: width(22),
        width: width(22),
        borderRadius: width(12),
        alignSelf: 'center'
    },
    smallText: {
        color: colors.appTextColor5
    },
    filterButtonWrapper: {
        marginVertical: sizes.baseMargin,
        // marginHorizontal: null,
    },
    filterButton: {
        marginHorizontal: null,
        marginHorizontal: width(3)
    },
    absoluteWrapper: {
        paddingHorizontal: width(3),
        paddingVertical: width(1),
        borderRadius: sizes.inputRadius
    },
    applicantsWrapper: {
        height: 40,
        backgroundColor: colors.primary,
        borderRadius: sizes.buttonMiniRadius,
        // width: 185
    },
    statusContainer: {
        height: 25,
        borderRadius: sizes.buttonMiniRadius,
        paddingHorizontal: width(4)
    },
})