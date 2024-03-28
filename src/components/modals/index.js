import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Icon } from 'react-native-elements';
import { height, totalSize, width } from 'react-native-dimension';
import { colors, sizes, appStyles, appImages } from '../../services';
import { CardWrapper, RowWrapper, ComponentWrapper, Wrapper, AbsoluteWrapper, ImageBackgroundWrapper, RoundedWrapper, RowWrapperBasic } from '../wrappers';
import { Spacer } from '../spacers';
import { TinyTitle, RegularText, MediumText, SmallTitle, LargeTitle } from '../text';
import { TextInputColored, TextInputBordered, TextInputSimpleBordered, TextInputBorderUpTitle } from '../textInput';
import Modal from 'react-native-modal'
import { ButtonColored, ButtonBordered, BackArrowButton } from '../buttons';
import { SearchIcon, IconButton, IconWithText } from '../icons';
import { styles } from './styles';
import { LineHorizontal } from '../lines';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';

// export const ModalSearchableSelection = ({ containerStyle, isVisible, options, title, onChangeText, onPressDone, onPressOption, onPressSearch }) => {
//     return (
//         <Modal
//             isVisible={isVisible}
//             // animationIn="fadeIn"
//             //animationOut="fadeOut"
//             style={{ margin: 0 }}
//         >
//             <Wrapper flex={1}>
//                 <Wrapper flex={2}></Wrapper>
//                 <Wrapper flex={8} style={[{ borderRadius: sizes.modalRadius, backgroundColor: colors.appBgColor1 }, containerStyle]}>
//                     <Spacer height={sizes.baseMargin} />
//                     <TinyTitle style={[appStyles.textCenter]}>{title}</TinyTitle>
//                     <Spacer height={sizes.baseMargin} />
//                     <TextInputBordered
//                         placeholder="Search"
//                         onChangeText={onChangeText}
//                         inputStyle={{ height: height(5) }}
//                         animation="fadeIn"
//                         left={
//                             <SearchIcon
//                                 style={{ marginLeft: sizes.marginHorizontal }}
//                                 onPress={onPressSearch}
//                             />
//                         }
//                     />
//                     <Spacer height={sizes.baseMargin} />
//                     <FlatList
//                         data={options}
//                         renderItem={({ item, index }) => {
//                             return (
//                                 // <ComponentWrapper>
//                                 //     <CheckBoxPrimary
//                                 //         text={item.title}
//                                 //         checked={item.selected}
//                                 //         onPress={() => onPressOption(item, index)}
//                                 //         textStyle={[appStyles.textRegular]}
//                                 //     />
//                                 //     <Spacer height={sizes.baseMargin} />
//                                 // </ComponentWrapper>
//                                 <Wrapper animation="fadeInUp" duration={250 * (index + 1)}>
//                                     <ButtonBordered
//                                         text={item.title}
//                                         onPress={() => onPressOption(item, index)}
//                                         buttonStyle={item.selected ? styles.selectedProfessionsCard : styles.professionsCard}
//                                         tintColor={item.selected ? colors.appTextColor1 : colors.appBgColor3}
//                                     />
//                                 </Wrapper>
//                             )
//                         }}
//                     />
//                     <Wrapper style={[appStyles.shadow, { backgroundColor: colors.appBgColor1 }]}>
//                         <Spacer height={sizes.baseMargin} />
//                         <ButtonGradiantColored
//                             text="Done"
//                             onPress={onPressDone}
//                         />
//                         <Spacer height={sizes.baseMargin} />
//                     </Wrapper>
//                 </Wrapper>
//             </Wrapper>
//         </Modal>
//     );
// }


export const SwipableModal = ({ children, title, isVisible, toggleModal, footerFlex, headerFlex, swipeDisabled }) => {
    return (
        <Modal
            isVisible={isVisible}
            swipeDirection={swipeDisabled ? null : "down"}
            onSwipeComplete={toggleModal}
            style={{ margin: 0 }}
            onBackdropPress={toggleModal}
            backdropOpacity={0}
        >
            <Wrapper flex={1} style={{ backgroundColor: 'transparent' }}>
                <Wrapper flex={headerFlex ? headerFlex : 1.5} style={{ backgroundColor: 'transparent' }} />
                <Wrapper flex={footerFlex ? footerFlex : 8.5} style={[styles.swipableModalFooter]}>
                    <AbsoluteWrapper style={[styles.barContainer]}>
                        <Wrapper style={[appStyles.center]}>
                            <TouchableOpacity onPress={toggleModal}>
                                <LineHorizontal
                                    height={4}
                                    width={width(15)}
                                    style={{ borderRadius: 5 }}
                                    color={colors.appBgColor3}
                                />
                            </TouchableOpacity>
                            <Spacer height={sizes.baseMargin} />
                            <TinyTitle>{title}</TinyTitle>
                        </Wrapper>
                    </AbsoluteWrapper>
                    {children}
                </Wrapper>
            </Wrapper>
        </Modal>
    );
}

export const LocationModal = ({ isManualShown, children, icon, title, detail, isVisible, toggleModal, buttonText, secondButtonText, onPressButtonLocation, onPressButtonManual, onPressButton, onPressBack }) => {
    return (
        <Modal
            isVisible={isVisible}
            swipeDirection="down"
            onSwipeComplete={toggleModal}
            style={{ margin: 0 }}
            onBackdropPress={toggleModal}
            backdropOpacity={.5}
        >
            <Wrapper flex={1} style={[{ justifyContent: 'center', }]}>
                <CardWrapper style={[styles.confirmationModalPrimaryCard]}>
                    {
                        !isManualShown ?
                            <Wrapper>
                                <Spacer height={sizes.baseMargin} />
                                <SmallTitle style={[appStyles.textCenter, { color: colors.appTextColor7 }]}>{title ? title : 'Title'}</SmallTitle>
                                <Spacer height={sizes.baseMargin} />
                                <Wrapper style={{ height: 130, width: '100%', margin: 0 }}>
                                    <ImageBackgroundWrapper source={require('../../assets/images/mapsBackground.png')}
                                        style={{ height: 130, width: '100%' }}>
                                        <Wrapper style={[appStyles.center, { height: "100%" }]}>
                                            <RoundedWrapper style={[{ height: sizes.cameraBgHeight, width: sizes.cameraBgWeidth, borderRadius: sizes.CamBgRadius, backgroundColor: colors.appColorFaded }]}>
                                                <IconWithText iconName='location-outline'
                                                    iconSize={sizes.icons.xxxl}
                                                    tintColor={colors.primary} />
                                            </RoundedWrapper>
                                        </Wrapper>
                                    </ImageBackgroundWrapper>
                                </Wrapper>
                                {
                                    detail ?
                                        <Wrapper style={{ marginHorizontal: 70 }}>
                                            <Spacer height={sizes.baseMargin * 1.5} />
                                            <MediumText style={[appStyles.textCenter, { color: colors.appTextColor7 }]}>{detail ? detail : 'Details and description'}</MediumText>
                                        </Wrapper>
                                        :
                                        null
                                }
                                <Spacer height={sizes.baseMargin} />
                                <Wrapper style={appStyles.center}>
                                    <ButtonColored
                                        buttonColor={colors.primary}
                                        text={buttonText ? buttonText[0] : 'OK'}
                                        onPress={onPressButtonLocation}
                                        buttonStyle={{ marginHorizontal: 0, width: width(60) }}
                                    />
                                    <Spacer height={sizes.smallMargin} />
                                    <ButtonColored
                                        buttonColor={colors.appColor6}
                                        text={buttonText ? buttonText[1] : 'OK'}
                                        onPress={onPressButtonManual}
                                        buttonStyle={{ marginHorizontal: 0, width: width(60) }}
                                    />
                                </Wrapper>
                                <Spacer height={sizes.baseMargin} />
                            </Wrapper>
                            :
                            <Wrapper  >
                                <Spacer height={sizes.baseMargin} />
                                <SmallTitle style={[appStyles.textCenter, { color: colors.appTextColor7 }]}>{title ? title : 'Title'}</SmallTitle>
                                <ComponentWrapper>
                                    <BackArrowButton onPress={onPressBack} />
                                </ComponentWrapper>
                                <Wrapper style={[appStyles.center, {}]}>
                                    <RoundedWrapper style={[{ height: sizes.cameraBgHeight / 1.5, width: sizes.cameraBgWeidth / 1.5, borderRadius: sizes.CamBgRadius, backgroundColor: colors.appColor7 }]}>
                                        <IconWithText iconName='location-outline'
                                            iconSize={sizes.icons.xl}
                                            tintColor={colors.primary} />
                                    </RoundedWrapper>
                                    <Wrapper>
                                        <Spacer height={sizes.smallMargin} />
                                        <TextInputSimpleBordered inputStyle={modalStyles.inputText} placeholder='city' />
                                        <Spacer height={sizes.smallMargin} />
                                        <TextInputSimpleBordered inputStyle={modalStyles.inputText} placeholder='State' />
                                        <Spacer height={sizes.smallMargin} />
                                        <TextInputSimpleBordered inputStyle={modalStyles.inputText} placeholder='Zip Code' keyboardType='phone' />
                                    </Wrapper>
                                </Wrapper>
                                {
                                    detail ?
                                        <Wrapper style={{ marginHorizontal: 70 }}>
                                            <Spacer height={sizes.baseMargin * 1.5} />
                                            <MediumText style={[appStyles.textCenter, { color: colors.appTextColor7 }]}>{detail ? detail : 'Details and description'}</MediumText>
                                        </Wrapper>
                                        :
                                        null
                                }
                                <Spacer height={sizes.doubleBaseMargin * 1.3} />
                                <Wrapper style={appStyles.center}>
                                    <ButtonColored
                                        buttonColor={colors.primary}
                                        text={secondButtonText ? secondButtonText : 'OK'}
                                        onPress={onPressButton}
                                        buttonStyle={{ marginHorizontal: 0, width: width(80) }}
                                    />
                                </Wrapper>
                                <Spacer height={sizes.baseMargin} />
                            </Wrapper>}
                </CardWrapper>
            </Wrapper>
        </Modal>
    );
}

export const ErrorModalPrimary = ({ children, icon, title, detail, isVisible, toggleModal, tintColor, iconName, iconType, iconSize, buttonText, onPressButton }) => {
    return (
        <Modal
            isVisible={isVisible}
            //swipeDirection="down"
            //onSwipeComplete={toggleModal}
            style={{ margin: 0 }}
            onBackdropPress={toggleModal}
            backdropOpacity={.5}
        >
            <Wrapper flex={1} style={[{ justifyContent: 'center', }]}>
                <CardWrapper style={[styles.confirmationModalPrimaryCard]}>
                    <Wrapper style={[appStyles.center]}>
                        <IconWithText iconName={iconName}
                            iconSize={iconSize}
                            tintColor={tintColor}
                        />
                    </Wrapper>
                    <TinyTitle style={[appStyles.textCenter]}>{title ? title : 'Title'}</TinyTitle>
                    {
                        detail ?
                            <Wrapper>
                                <Spacer height={sizes.baseMargin * 1.5} />
                                <RegularText style={[appStyles.textCenter]}>{detail ? detail : 'Details and description'}</RegularText>
                            </Wrapper>
                            :
                            null
                    }
                    <Spacer height={sizes.baseMargin} />
                    {children}
                </CardWrapper>
            </Wrapper>
        </Modal>
    );
}

export const EnterValuePrimaryModal = ({ children, placeholder, title, value, onChangeText, isVisible, toggleModal, buttonText, onPressButton }) => {
    return (
        <Modal
            isVisible={isVisible}
            //swipeDirection="down"
            //onSwipeComplete={toggleModal}
            style={{ margin: 0 }}
            onBackdropPress={toggleModal}
            backdropOpacity={0}
        >
            <Wrapper flex={1} style={[{ justifyContent: 'center', }]}>
                <CardWrapper style={[styles.enterValueModalPrimaryCard]}>
                    <TinyTitle >{title ? title : 'Title'}</TinyTitle>
                    <Spacer height={sizes.baseMargin} />
                    <TextInputBordered
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        containerStyle={{ marginHorizontal: 0 }}
                    />
                    <Spacer height={sizes.baseMargin} />
                    {/* <ButtonGradiantColored
                        text={buttonText ? buttonText : 'ADD'}
                        onPress={onPressButton}
                        buttonStyle={{ marginHorizontal: 0 }}
                    /> */}
                    {children}
                </CardWrapper>
            </Wrapper>
        </Modal>
    );
}

export const FillterModel = ({ children, placeholder, title, value, onChangeText, isVisible, toggleModal, buttonText, onPressButton }) => {
    return (
        <Modal
            isVisible={isVisible}
            // swipeDirection="down"
            // onSwipeComplete={toggleModal}
            style={{ margin: 0 }}
            onBackdropPress={toggleModal}
            backdropOpacity={.5}
        >
            <Wrapper flex={1} style={[{ justifyContent: 'center', }]}>
                <CardWrapper style={[styles.fillterModelCard]}>
                    <LargeTitle>Job type</LargeTitle>
                    <RowWrapperBasic style={{ marginVertical: sizes.baseMargin }}>
                        <ButtonColored text='Part Time' buttonColor={colors.primary}
                            buttonStyle={modalStyles.fillterModelButtonColored} />
                        <ButtonColored text='Full time' buttonColor={colors.appColor8}
                            tintColor={colors.primary}
                            buttonStyle={modalStyles.fillterModelButtonColored} />
                    </RowWrapperBasic>
                    <LargeTitle>Location</LargeTitle>
                    <RowWrapperBasic style={{ marginVertical: sizes.baseMargin }}>
                        <ButtonBordered text='Resturant' buttonColor={colors.primary}
                            borderColor={colors.primary} tintColor={colors.appTextColor7}
                            buttonStyle={modalStyles.fillterModelButtonColored} />
                        <ButtonBordered text='Event' buttonColor={colors.appColor8}
                            borderColor={colors.primary} tintColor={colors.appTextColor7}
                            buttonStyle={modalStyles.fillterModelButtonColored} />
                    </RowWrapperBasic>
                    <LargeTitle>Type</LargeTitle>
                    <RowWrapperBasic style={{ marginVertical: sizes.baseMargin }}>
                        <ButtonColored text='Resturant' buttonColor={colors.primary}
                            buttonStyle={modalStyles.fillterModelButtonColored} />
                        <ButtonColored text='Event' buttonColor={colors.appColor8}
                            tintColor={colors.primary}
                            buttonStyle={modalStyles.fillterModelButtonColored} />
                    </RowWrapperBasic>
                    {children}
                </CardWrapper>
            </Wrapper>
        </Modal>
    );
}

export const CustomizedModel = ({ innerStyle, onBackdropPress, swipeDirection, children, placeholder, title, value, onChangeText, isVisible, toggleModal, buttonText, onPressButton }) => {
    return (
        <Modal
            isVisible={isVisible}
            swipeDirection={swipeDirection}
            onSwipeComplete={toggleModal}
            style={{ margin: 0, padding: 0 }}
            onBackdropPress={onBackdropPress}
            backdropOpacity={.5}
        >
            <Wrapper style={[{ justifyContent: 'center', }]}>
                <CardWrapper style={[styles.fillterModelCard, innerStyle]}>
                    {children}
                </CardWrapper>
            </Wrapper>
        </Modal>
    );
}

export const DatePickerModal = ({ isTimeModal, onPress, text, onConfirm, setOpen, setDate, onCancel, notPicker }) => {

    return (
        <Wrapper style={modalStyles.datePickerModal}>
           {!notPicker && <DatePicker
                mode={isTimeModal ? "time" : "date"}
                modal
                open={setOpen}
                date={setDate}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />}
            <IconWithText onPress={onPress} tintColor={colors.primary}
                iconName={isTimeModal ? 'time-outline' : 'calendar-outline'}
                text={moment(text).format(isTimeModal ? 'h:mm A' : 'MM/DD/YYYY')} />
        </ Wrapper>
    )
}
export const DatePickerHorizontal = ({ title, onPress, text, onConfirm, setOpen, setDate, onCancel }) => {

    return (
        <Wrapper>
            <DatePicker
                mode={"date"}
                modal
                open={setOpen}
                date={setDate}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
            <TextInputBorderUpTitle
                onPress={onPress}
                title={title}
                editable={false}
                required
                value={moment(text).format('MMM YYYY')}
                containerStyle={styles.modelTextInputRow} />
        </ Wrapper>
    )
}

export const SelectionModal = ({ toggleModal, isVisible, onPressCamera, onPressGallery }) => {
    return (

        <Modal
            isVisible={isVisible}
            toggleModal={toggleModal}
            swipeDirection={['up', 'down', 'right', 'left']}
            onSwipeComplete={toggleModal}
            style={{ margin: 0 }}
            onBackdropPress={toggleModal}
            backdropOpacity={.5}
        >
            <Wrapper style={[{ justifyContent: 'center', }]}>
                <CardWrapper style={[styles.fillterModelCard]}>
                    <Wrapper style={appStyles.center}>
                        <IconWithText
                            onPress={onPressCamera}
                            iconName={'camera-outline'}
                            tintColor={colors.appTextColor5}
                            text={'Select Camera'}
                            textStyle={modalStyles.modaltext} />
                        <Spacer height={sizes.baseMargin} />
                        <LineHorizontal width={'100%'} />
                        <Spacer height={sizes.baseMargin} />
                        <IconWithText
                            onPress={onPressGallery}
                            iconName={'image-outline'}
                            tintColor={colors.appTextColor5}
                            text={'Select Gallery'}
                            textStyle={modalStyles.modaltext} />
                    </Wrapper>
                </CardWrapper>
            </Wrapper >
        </Modal >
    )
}


const modalStyles = StyleSheet.create({
    inputText: {
        width: width(50),
        textAlign: 'center'
    },
    fillterModelButtonColored: {
        width: width(30),
        height: height(6),
        marginEnd: width(3),
        marginHorizontal: 0
    },
    datePickerModal: {
        backgroundColor: colors.appBgColor6,
        borderRadius: sizes.buttonSmallRadius,
        padding: 7,
        marginEnd: 10
    },
    modaltext: {
        ...appStyles.h5,
        marginStart: width(5),
        color: colors.appTextColor5,
    },
    modelTextInputRow: {
        marginHorizontal: 0,
        width: width(30)
    },
})