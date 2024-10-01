// MovieList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

const MovieList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]); 

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (query = '') => {
    const apiKey = '9f3cab36e2cc9fee164ca22d5d706e34'; 
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
    setMovies(response.data.results);
  };

  const fetchMovieSuggestions = async (query: string) => {
    if (query.length > 1) {
      const apiKey = '9f3cab36e2cc9fee164ca22d5d706e34';
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
      setSuggestions(response.data.results.slice(0, 5)); // Limit suggestions to 5
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    fetchMovies(searchQuery);
    setSuggestions([]); 
  };

  const handleSuggestionClick = (movie: Movie) => {
    setSearchQuery(movie.title); 
    setSuggestions([]); 
    navigation.navigate('Деталі фільму', { movieId: movie.id });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Пошук фільмів"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          fetchMovieSuggestions(text);
        }}
        onSubmitEditing={handleSearch}
      />
      {}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionClick(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Деталі фільму', { movieId: item.id })}>
            <View style={styles.movieItem}>
              {item.poster_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                  style={styles.movieImage}
                />
              )}
              <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF3E0', 
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#DEAA8D', 
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#FFFFFF', 
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 70, 
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DEAA8D',
    backgroundColor: '#FDF1DC',
  },
  suggestionText: {
    fontSize: 16,
    color: '#8B4513', 
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFE4B5', 
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600', 
    color: '#8B4513',
    flexShrink: 1, 
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default MovieList;
