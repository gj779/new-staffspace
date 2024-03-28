import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonColored, EnterValuePrimaryModal, ExpertyPrimaryCard, FeedCard, FillterModel, FilterButton, HomeHeader, ImageRound, LineHorizontal, MainWrapper, OptionButton, RenderHomeFeed, RowWrapper, Spacer, TextInputSearch, UserInfoPrimaryCard, Wrapper } from '../../../components';
import { appImages, appStyles, colors, HandleFavourites, routes, sizes } from '../../../services';
import { totalSize, width } from 'react-native-dimension';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native'
import { addToArray, deleteDocument, getAllOfCollection, saveData, uniqueID } from '../../../backend/utility';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import { addFavorites, all_jobs, removeFavorites } from '../../../redux/actions';

const Home = ({ navigation }) => {

    const user_redux = useSelector(state => state.user)
    const favorites_list = useSelector(state => state.favorites)
    const jobs_redux = useSelector(state => state?.allJobs)
    const dispatch = useDispatch()
    const [ex, setEx] = useState()
    const [isModalShown, setIsModalShown] = useState(false)
    const [feedItems, setFeedItems] = useState(jobs_redux)
    const [feedItems1, setFeedItems1] = useState(jobs_redux)
    const [search_query, setSearchQuery] = useState('')
    const [user, setUser] = useState(user_redux)
    const [favs, setFavs] = useState(favorites_list)


    useEffect(() => {
        setUser(user_redux)
    }, [user_redux])

    useEffect(() => {
        setFavs(favorites_list)
    }, [favorites_list])

    useEffect(() => {
        setFeedItems(jobs_redux)
        setFeedItems1(jobs_redux)
    }, [jobs_redux])

    const HandleIsLiked = (item, index) => {
        HandleFavourites(item, index, feedItems, setFeedItems, dispatch, all_jobs, setEx)
    }

    const search_data = text => {
        setSearchQuery(text)
        let jobs_search = feedItems1?.filter(function (item) {
            const item_data = `${item.user.userType} ${item.user.username} ${item.address} ${item.title} ${item.JobType}`.toUpperCase();
            const text_data = text.toUpperCase();
            return item_data.indexOf(text_data) > -1;
        });

        setFeedItems(jobs_search);
    }
    const HandleFilters = (value) => {
        let filteredData = []
        if (value == '1') {
            setFeedItems(feedItems1)
        }
        else if (value == '2') {
            filteredData = feedItems1.filter(post => post.user.userType == 'Event')
            setFeedItems(filteredData)
        }
        else if (value == '3') {
            filteredData = feedItems1.filter(post => post.user.userType == 'Resturant')
            setFeedItems(filteredData)
        }
        else if (value == '4') {
            filteredData = feedItems1.filter(post => post.JobType == 'Full Time')
            setFeedItems(filteredData)
        }
        else if (value == '5') {
            filteredData = feedItems1.filter(post => post.JobType == 'Part Time')
            setFeedItems(filteredData)
        }
    }
    const CheckedOption = (props) => (
        <MenuOption value={props.value} text={(props.checked ? '\u2713 ' : '') + props.text} />
    )
    return (
        <MainWrapper>
            <Wrapper flex={1}>
                <HomeHeader
                    onPressProfile={() => navigation.navigate(routes?.myProfileStack)}
                    onPress={() => navigation.toggleDrawer()}
                    source={{ uri: user?.profilePhoto }}
                />
                <Spacer height={sizes.baseMargin} />
                <RowWrapper>
                    <Wrapper>
                        <TextInputSearch
                            value={search_query}
                            onChangeText={text => search_data(text)}
                            placeholder='Search for jobs and events'
                            width={width(77)} />
                    </Wrapper>
                    <Wrapper>
                        <Menu
                            onSelect={value => HandleFilters(value)}
                            renderer={renderers.NotAnimatedContextMenu}>
                            <MenuTrigger>
                                <FilterButton
                                    iconName='filter-outline'
                                    iconSize={sizes.icons.large}
                                    iconColor={colors.primary}
                                />
                            </MenuTrigger>
                            <MenuOptions customStyles={optionsStyles}>
                                <CheckedOption value={1} text='All' />
                                <LineHorizontal />
                                <CheckedOption value={2} text='Events' />
                                <LineHorizontal />
                                <CheckedOption value={3} text='Restaurant' />
                                <LineHorizontal />
                                <CheckedOption value={4} text='Full Time' />
                                <LineHorizontal />
                                <CheckedOption value={5} text='Part Time' />
                            </MenuOptions>
                        </Menu>
                    </Wrapper>
                    {/* <OptionButton
                        iconName={'filter-outline'}
                        iconSize={sizes.icons.large}
                        iconColor={colors.primary}
                        style={styles.optionButton}
                        onPress={() => setIsModalShown(!isModalShown)}
                    /> */}
                    {/* <FillterModel isVisible={isModalShown} >
                        <RowWrapper style={styles.filterButtonWrapper}>
                            <Wrapper flex={3}>
                                <ButtonColored text={'Show results'}
                                    buttonColor={colors.primary}
                                    buttonStyle={styles.filterButton}
                                    onPress={() => setIsModalShown(!isModalShown)} />
                            </Wrapper>
                            <Wrapper flex={1}>
                                <ButtonColored text={'Clear'}
                                    buttonColor={colors.appBgColor5}
                                    tintColor={colors.white}
                                    buttonStyle={styles.filterButton} />
                            </Wrapper>
                        </RowWrapper>
                    </FillterModel> */}
                </RowWrapper>
                <Spacer height={sizes.TinyMargin} />
                <RenderHomeFeed
                    isApplicant
                    data={feedItems}
                    onPressHeart={(item, index) => HandleIsLiked(item, index)}
                    onPress={(item, index) => navigation.navigate(routes.resturantProfile, { item: item, idx: index })} />
            </Wrapper>
        </MainWrapper>
    )
}

export default Home;

const styles = StyleSheet.create({
    filterButtonWrapper: {
        marginVertical: sizes.baseMargin,
        marginHorizontal: null
    },
    filterButton: {
        marginHorizontal: null,
        marginEnd: width(3)
    },
    optionButton: {
        height: totalSize(5),
        width: totalSize(5)
    }
})
const optionsStyles = {
    optionsContainer: {
        // backgroundColor: 'green',
        padding: 5,
        borderRadius: 10
    },
    optionsWrapper: {
        // backgroundColor: 'purple',
    },
    optionWrapper: {
        // backgroundColor: 'yellow',
        margin: 5,
    },
    optionTouchable: {
        underlayColor: 'gold',
        activeOpacity: 70,
    },
    optionText: {
        // color: 'brown',
        alignSelf: 'center'
    },
};