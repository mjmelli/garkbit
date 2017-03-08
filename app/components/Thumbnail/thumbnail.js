import React, { PropTypes } from 'react';

const Thumbnail = ({ photo }) => {
    let style;
    if (photo.isSelected) {
        style = { border: '1px solid black' };
    }

    return (
        <div style={style}>
            <img data-id={photo.id} src={'/images/photos/' + photo.sizes.thumb.uri} alt={photo.fn} />
        </div>
    );
}

Thumbnail.PropTypes = {
    photo: PropTypes.object.isRequired,
};

export default Thumbnail;
