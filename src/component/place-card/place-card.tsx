import { Link, useLocation } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { getRatingPercentage, handleFavoriteClick } from '../../utils/utils';
import { OfferType } from '../../types/offers';
import { useAppSelector } from '../../hooks';
import { getAuthorizationStatus } from '../../store/user-process/selectors';
import { memo } from 'react';

type PlaceCardProps = {
  offer: OfferType;
  onCardHover?: (offerId: string) => void;
}

function PlaceCard({offer, onCardHover}: PlaceCardProps): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const location = useLocation();
  const offerLink = `${AppRoute.Offer}/${offer.id}`;

  const handleMouseEnter = () => onCardHover?.(offer.id);

  let articleClassName = 'place-card';
  let divImageClassName = 'place-card__image-wrapper';
  let imageWidth = 260;
  let imageHeight = 200;

  switch (location.pathname) {
    case AppRoute.Root:
      articleClassName = `cities__card ${articleClassName}`;
      divImageClassName = `cities__image-wrapper ${divImageClassName}`;
      break;
    case AppRoute.Favorites:
      articleClassName = `favorites__card ${articleClassName}`;
      divImageClassName = `favorites__image-wrapper ${divImageClassName}`;
      imageWidth = 150;
      imageHeight = 110;
      break;
    default:
      if (location.pathname.startsWith(`${AppRoute.Offer}/`)) {
        articleClassName = `near-places__card ${articleClassName}`;
        divImageClassName = `near-places__image-wrapper ${divImageClassName}`;
      }
      break;
  }

  return (
    <article
      className={articleClassName}
      onMouseEnter={handleMouseEnter}
    >
      {offer.isPremium ?
        <div className="place-card__mark">
          <span>Premium</span>
        </div> : ''}
      <div className={divImageClassName}>
        <Link to={offerLink}>
          <img className="place-card__image" src={offer.previewImage} width={imageWidth} height={imageHeight} alt="Place image" />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`
              place-card__bookmark-button
              button
              ${offer.isFavorite && authorizationStatus === AuthorizationStatus.Auth ? 'place-card__bookmark-button--active' : ''}`}
            type="button"
            onClick={handleFavoriteClick(offer.id, Number(!offer.isFavorite))}
          >
            <svg className="place-card__bookmark-icon" width={18} height={19}>
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${getRatingPercentage(offer.rating)}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={offerLink}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
}

const MemorizedPlaceCard = memo(PlaceCard);

export default MemorizedPlaceCard;
