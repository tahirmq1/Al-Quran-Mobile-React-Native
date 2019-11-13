import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import axios from 'axios';
import HTML from 'react-native-render-html';
import CardView from 'react-native-cardview';

import Loading from '../../Components/LoadingComponent/Loading';
import { Styles } from './Quran_detail.styles';
import { Constants } from '../../Utils/Constants';
import { Colors } from '../../Utils/Colors';
import { quranDetail } from '../../Utils/EndPoints';
import Basmallah from '../../Components/BasmallahComponent/Basmallah';

class QuranList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailSurah: [],
      refreshing: false,
      isLoading: false,
    };
  }

  static navigationOptions = ({
    navigation: {
      state: {
        params: { dataSurah },
      },
    },
  }) => {
    const suratName = dataSurah.surat_name;
    const suratArabic = dataSurah.surat_text;
    const suratTranslate = dataSurah.surat_terjemahan;
    const countAyat = dataSurah.count_ayat;
    return {
      headerTitle: (
        <View>
          <Text style={Styles.headerTitle}>
            {suratName} ({suratArabic})
          </Text>
          <Text style={Styles.headerSubtitle}>
            {suratTranslate} - {countAyat} Ayat
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  componentDidMount() {
    this.renderDetailSurah();
  }

  renderDetailSurah = async () => {
    const { dataSurah } = this.props.navigation.state.params;
    const surah_id = dataSurah.id;
    const jml_ayat = dataSurah.count_ayat;

    try {
      this.setState({
        isLoading: true,
      });
      const res = await axios.get(quranDetail(surah_id, jml_ayat));
      const detailSurah = res.data.data;
      this.setState({
        detailSurah,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  keyExtractor = (item, index) => index.toString();

  onRefresh = () => {
    this.setState({ refreshing: true }, () => this.renderDetailSurah());
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  };

  listHeaderComponent = () => {
    const { dataSurah } = this.props.navigation.state.params;

    switch (dataSurah) {
      case Constants.DATA_SURAH.AL_FATIHAH:
        return null;
      case Constants.DATA_SURAH.AL_TAUBAH:
        return null;
      default:
        return <Basmallah />;
    }
  };

  renderCardContent = ({ item }) => {
    return (
      <CardView
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={5}
        style={Styles.CardStyle}>
        <View style={Styles.cardContainer}>
          <View style={Styles.numberCircleContainer}>
            <View style={Styles.NumberCircle}>
              <Text style={Styles.textNumber}>{item.aya_number}</Text>
            </View>
          </View>
          <View style={Styles.descContainer}>
            <Text style={Styles.descTextRight}>{item.aya_text}</Text>
            <HTML
              html={item.translation_aya_text}
              containerStyle={Styles.descTextLeftContainer}
              baseFontStyle={Styles.descTextLeft}
            />
          </View>
        </View>
      </CardView>
    );
  };

  render() {
    const { detailSurah, refreshing, isLoading } = this.state;

    return isLoading ? (
      <Loading />
    ) : (
      <View>
        <FlatList
          ListHeaderComponent={this.listHeaderComponent}
          data={detailSurah}
          keyExtractor={this.keyExtractor}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderCardContent}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
        />
      </View>
    );
  }
}

export default QuranList;
