import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FlatList, BackHandler } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { getQuranList } from '../../Redux/Actions/QuranList/QuranList';
import { ModalDialog } from '../../Components/ModalDialog/ModalDialogComponent';
import { Loading } from '../../Components/Loading/Loading.component';
import { CardSurahList } from '../../Components/CardSurahList/CardSurahList.component';
import { Separator } from '../../Components/Separator/Separator.component';
import { Routes } from '../../Navigation/Routes';
import { keyExtractor } from '../../Utils/Helper';

const QuranList = ({ navigation }) => {
  const dispatch = useDispatch();

  const { data, isLoading, isError, errorMessage, refreshing } = useSelector(
    state => ({
      data: state.quranList.data,
      isLoading: state.quranList.loading,
      isError: state.quranList.error,
      errorMessage: state.quranList.errorMessage,
      refreshing: state.quranList.refreshing,
    }),
  );

  React.useEffect(() => {
    SplashScreen.hide();
    getDataQuran();
  }, [getDataQuran]);

  const getDataQuran = React.useCallback(async () => {
    await dispatch(getQuranList());
  }, [dispatch]);

  const goToDetailpage = dataSurah => {
    navigation.navigate(Routes.QuranDetail, { dataSurah });
  };

  const renderListEmpty = () => {
    return (
      <ModalDialog
        type="Peringatan"
        isVisible={isError}
        onPressOke={() => BackHandler.exitApp()}
        message={errorMessage}
      />
    );
  };

  const renderCardContent = ({ item }) => {
    return (
      <CardSurahList
        surahNumber={item?.id}
        surahText={item?.surat_text}
        surahName={item?.surat_name}
        surahMean={item?.surat_terjemahan}
        surahAyat={item?.count_ayat}
        onPress={() => goToDetailpage(item)}
      />
    );
  };

  return isLoading ? (
    <Loading />
  ) : (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderCardContent}
      refreshing={refreshing}
      onRefresh={getDataQuran}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={renderListEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default QuranList;
