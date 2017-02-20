import Config from '../config';
import Fetch from 'isomorphic-fetch';

const items = [];

const onThumbnailsClick = (e) => {
    e.preventDefault();
    const clickedGallery = e.target.parentNode.parentNode;
    openPhotoSwipe(e.target.dataset.index, clickedGallery.dataset.id);
}

const getGalleryPhotos = (galleryId) => {
    Fetch(Config.API_URL + '/galleries/' + galleryId + '/photos')
    .then(response => response.json())
    .then(json => {
        const photos = json.photos;
        items[galleryId] = photos.map(function(photo) {
            return { src: '/images/photos/' + photo.sizes.original.uri, w: photo.sizes.original.width, h: photo.sizes.original.height }
        });
        const galleryNode = document.getElementById('gb-' + galleryId);
        galleryNode.className = 'gb-inline-gallery';
        photos.forEach(function(photo, i) {
            const thumbNode = document.createElement("div");
            thumbNode.className = 'gb-thumbnail-wrapper';
            const thumbImageNode = document.createElement("img");
            thumbImageNode.dataset.index = i;
            thumbImageNode.className = 'gb-thumbnail';
            thumbImageNode.src = '/images/photos/' + photo.sizes.thumb.uri;
            thumbImageNode.style.width = photo.sizes.thumb.width + 'px';
            thumbImageNode.style.height = photo.sizes.thumb.height + 'px';
            thumbImageNode.onclick = onThumbnailsClick;
            thumbNode.appendChild(thumbImageNode);
            galleryNode.appendChild(thumbNode);
        });
        return;
    })
    .catch(function(e) {
        console.log(e);
    })
}

const openPhotoSwipe = function(index, galleryId) {
    const pswpElement = document.querySelectorAll('.pswp')[0];

    const options = {
        index: parseInt(index, 10),
        //showHideOpacity: true,
        getThumbBoundsFn: function(index) {
            var thumbnail = document.getElementById('gb-' + galleryId).getElementsByTagName('img')[index],
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect();
            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        }
    };

    const galleryItems = items[galleryId];

    const gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, galleryItems, options);
    gallery.init();
}

getGalleryPhotos('58814006ec9c9d193232c28e');
//openPhotoSwipe('58475a7558102109e5f2e4b4');
