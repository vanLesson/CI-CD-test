import {format} from 'date-fns';
import Modal from 'react-native-modal';
import './i18.config';
import i18n from './i18.config';

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  SectionList,
  Dimensions,
  ScrollView,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import {useTranslation} from 'react-i18next';
const localization = ['en', 'es', 'pl', 'ro', 'ru', 'uk'];

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isOpenTask, setIsOpenTask] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#f6f5f5');
  const [update, setUpdate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isVisibleChange, setIsVisibleChange] = useState(false);
  const {t} = useTranslation();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleOpenModal = (item, key) => {
    setIsVisible(true);
    setSelectedItem({item, key});
  };
  const onSave = async () => {
    const data = await AsyncStorage.getItem(
      format(new Date(time), 'EEEE dd MMMM'),
    );

    if (data) {
      await AsyncStorage.setItem(
        format(new Date(time), 'EEEE dd MMMM'),
        JSON.stringify([
          ...JSON.parse(data),
          {
            title: title,
            description: description,
            color: color,
          },
        ]),
      );
    } else {
      await AsyncStorage.setItem(
        format(new Date(time), 'EEEE dd MMMM'),
        JSON.stringify([
          {
            title: title,
            description: description,
            color: color,
            id: Math.random(),
          },
        ]),
      );
    }
    clear();
  };
  const getData = async () => {
    const res = await AsyncStorage.getAllKeys();
    if (res) {
      const result = await AsyncStorage.multiGet(res);
      if (result) {
        const localList = result.map(e => ({
          title: e[0],
          data: JSON.parse(e[1] as string),
        }));
        setDataList(localList);
      }
    }
  };
  useEffect(() => {
    setTimeout(() => {
      void getData();
    }, 2000);
  }, [update]);
  const clear = () => {
    setTitle('');
    setDescription('');
    setIsOpenTask(false);
    setColor('#f6f5f5');
    setUpdate(!update);
    setIsVisible(false);
    setSelectedItem(null);
  };

  const handleDelete = async (item, id) => {
    const data = await AsyncStorage.getItem(item);
    if (data) {
      const res = JSON.parse(data).filter(e => e.id !== id);
      await AsyncStorage.setItem(item, JSON.stringify(res));
    }
    clear();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <DatePicker
        modal
        open={open}
        date={time}
        onConfirm={date => {
          setOpen(false);
          setTime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <ScrollView style={[{padding: 20, flex: 1, gap: 10}]}>
        <Text style={{fontSize: 20}}>
          {t('hello')} {format(new Date(time), 'EEEE dd MMMM')}
        </Text>
        {/*  <TouchableOpacity
          onPress={() => {
            setOpen(true);
          }}>
          <Text style={{fontSize: 20, fontWeight: '800'}}>
            {t('changeDate')}
          </Text>
        </TouchableOpacity>*/}
        <TouchableOpacity
          onPress={() => {
            setIsVisibleChange(true);
          }}>
          <Text style={{fontSize: 20, fontWeight: '800'}}>Change locale</Text>
        </TouchableOpacity>
        {!isOpenTask ? (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setIsOpenTask(true)}>
            <Text style={{fontSize: 20}}>+</Text>
            <Text style={{fontSize: 20}}> {t('addTask')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{flex: 1}}>
            <View style={styles.inputWrapper}>
              <View>
                <TextInput
                  placeholder={'Task name'}
                  value={title}
                  onChangeText={t => setTitle(t)}
                  maxLength={100}
                  multiline={true}
                  style={{borderBottomWidth: 1, borderColor: 'black'}}
                />
                <TextInput
                  placeholder={'Task description'}
                  value={description}
                  onChangeText={t => setDescription(t)}
                  maxLength={200}
                  multiline={true}
                  style={{borderBottomWidth: 1, borderColor: 'black'}}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.roundGreen,
                    color === '#8ABE7AFF' ? {borderWidth: 2} : {},
                  ]}
                  onPress={() => setColor('#8ABE7AFF')}
                />
                <TouchableOpacity
                  style={[
                    styles.roundBlue,
                    color === '#FFFFFF' ? {borderWidth: 2} : {},
                  ]}
                  onPress={() => setColor('#FFFFFF')}
                />
                <TouchableOpacity
                  style={[
                    styles.roundRed,
                    color === '#be7a7a' ? {borderWidth: 2} : {},
                  ]}
                  onPress={() => setColor('#be7a7a')}
                />
              </View>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.cancel} onPress={clear}>
                <Text>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.add, !title ? {backgroundColor: '#b4b4b4'} : {}]}
                disabled={!title}
                onPress={onSave}>
                <Text>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <SectionList
          style={{flex: 1}}
          sections={dataList}
          renderSectionHeader={data => {
            return <Text style={styles.title}>{data.section.title}</Text>;
          }}
          renderItem={({item, section}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.item,
                  {backgroundColor: item.color, flexDirection: 'row'},
                ]}
                onPress={() => handleOpenModal(item, section.title)}>
                <View>
                  <Text style={styles.text}>{item.title}</Text>
                  <Text style={styles.text}>{item.description}</Text>
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <Text>{t('delete')}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
      <Modal
        isVisible={isVisible}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        deviceHeight={Dimensions.get('window').height - 100}>
        {isVisible && (
          <View
            style={{
              width: 200,
              height: 300,
              backgroundColor: selectedItem.item.color || '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              borderRadius: 20,
            }}>
            <Text>{selectedItem.item.title}</Text>
            <Text>{selectedItem.item.description}</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                onPress={() =>
                  handleDelete(selectedItem.key, selectedItem.item.id)
                }>
                <Text>{t('delete')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => clear()}>
                <Text>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      <Modal
        isVisible={isVisibleChange}
        onBackdropPress={() => setIsVisibleChange(false)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 200,
            backgroundColor: '#FFFFFF',
            padding: 20,
            alignItems: 'flex-start',
          }}>
          {localization.map(locale => (
            <TouchableOpacity
              key={locale}
              onPress={() => {
                i18n.changeLanguage(locale);
                setIsVisibleChange(false);
              }}>
              <Text style={{color: 'black', fontSize: 16}}>
                Change to {locale}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  add: {
    backgroundColor: 'green',
    opacity: 0.7,
    padding: 10,
    bottom: 23,
    borderRadius: 10,
  },
  cancel: {
    backgroundColor: 'red',
    opacity: 0.7,
    padding: 10,
    bottom: 23,
    borderRadius: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 5,
    marginTop: 10,
  },
  roundRed: {
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: '#be7a7a',
    opacity: 0.5,
  },
  roundBlue: {
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: '#7ab8be',
    opacity: 0.5,
  },
  roundGreen: {
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: '#8ABE7AFF',
    opacity: 0.5,
  },
  inputWrapper: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  title: {
    fontSize: 24,
  },
  text: {
    fontSize: 14,
  },
});

export default App;
