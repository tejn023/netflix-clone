import React, { useState, useEffect } from 'react';
import axios from './axios';
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original";

function Row({title, fetchUrl, isLargeRow}) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');

    // a snippet of code which runs based on a specific condition/variable
    // when this row loads, we want something to run
    
    useEffect(() => {
        // if [], run once when the row loads, and don't run it again        
        // if [movies], runs once and also whenever movies changes
        
        // async function when we send request to third party service
        async function fetchData () {
            const request = await axios.get(fetchUrl);
            // console.log(request); 
            setMovies(request.data.results);
            return request;
        }

        fetchData();
    // any variable used from outside (from props), needs to be put into []
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay:1,
        }
    }

    console.log(movies);
    const handleClick = (movie) => {
        if(trailerUrl) {
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.name || "")
            .then(url => {
                const urlPrams = new URLSearchParams( new URL(url).search);
                setTrailerUrl(urlPrams.get('v'));
            })
            .catch((error) => console.log(error));
        }
    }

    return (

        <div className="row">

            <h2>{title}</h2>

            <div className="row__posters">
                {/* several row__posters */}

                {movies.map(movie => (
                    
                    <img
                        key={movie.id}
                        onClick= {() => handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name}
                        />
                ))}
            </div>
        {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row;
