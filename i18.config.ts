import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';

const resources = {
  en: {
    main: {
      hello: 'Hello today is',
      changeDate: 'Change date',
      addTask: 'Add task',
      cancel: 'Cancel',
      add: 'Add',
      delete: 'Delete',
    },
  },
  es: {
    main: {
      hello: 'Hola hoy es',
      changeDate: 'Cambiar fecha',
      addTask: 'Agregar tarea',
      cancel: 'Cancelar',
      add: 'Agregar',
      delete: 'Borrar',
    },
  },
  pl: {
    main: {
      hello: 'Witam dzisiaj jest',
      changeDate: 'Zmień datę',
      addTask: 'Dodaj zadanie',
      cancel: 'Anulować',
      add: 'Dodać',
      delete: 'Usuwać',
    },
  },
  ro: {
    main: {
      hello: 'Bună ziua de azi este',
      changeDate: 'Schimba data',
      addTask: 'Adăugați sarcină',
      cancel: 'Anulare',
      add: 'Adăuga',
      delete: 'Șterge',
    },
  },
  ru: {
    main: {
      hello: 'Привет, сегодня ',
      changeDate: 'Изменить дату ',
      addTask: 'Добавтить задание',
      cancel: 'Отмена',
      add: 'Добавить',
      delete: 'Удалить',
    },
  },
  uk: {
    main: {
      hello: 'Вітаю, сьогодні',
      changeDate: 'Змінити дату',
      addTask: 'Дабавить завдяння',
      cancel: 'Відмінити',
      add: 'Добавити',
      delete: 'Удалити',
    },
  },
};
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: getLocales()[0].languageCode,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  ns: ['main'],

  resources,
  debug: true,
});
export default i18n;
