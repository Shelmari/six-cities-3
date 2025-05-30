import { useParams } from 'react-router-dom';
import { getRatingPercentage } from '../../utils/utils';
import NotFoundScreen from '../not-found-screen/not-found-screen';
import Reviews from '../../component/reviews/reviews';
import Map from '../../component/map/map';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useEffect } from 'react';
import { fetchCommentsAction, fetchNearbyOffersAction, fetchOfferByIdAction, setFavoriteStatusAction } from '../../store/api-actions';
import { getComments, getNearbyOffers, getOfferById, getOfferByIdLoadingStatus, getOffers } from '../../store/data-precess/selectors';
import MemorizedPlaceCard from '../../component/place-card/place-card';
import { getAuthorizationStatus } from '../../store/user-process/selectors';
import { AppRoute, AuthorizationStatus } from '../../const';
import { redirectToRoute } from '../../store/action';
import { loadOfferById, updateCards } from '../../store/data-precess/data-process';
import { processErrorHandle } from '../../services/process-error-handle';
import { Helmet } from 'react-helmet-async';
import LoadingScreen from '../../component/loading-screen/loading-screen';

const NEARBY_OFFERS_COUNT = 3;
const OFFER_IMGS_COUNT = 6;

function OfferScreen (): JSX.Element {
  const dispatch = useAppDispatch();
  const params = useParams();
  const currentOfferId = params.id;
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const offerById = useAppSelector(getOfferById);
  const nearbyOffers = useAppSelector(getNearbyOffers);
  const offersData = useAppSelector(getOffers);
  const isOfferByIdLoading = useAppSelector(getOfferByIdLoadingStatus);
  const currentOffer = offersData.find((item) => item.id === currentOfferId);
  const comment = useAppSelector(getComments);

  useEffect(() => {
    if (currentOfferId) {
      if (!offerById) {
        dispatch(fetchOfferByIdAction(currentOfferId));
      }
      if (!nearbyOffers.length) {
        dispatch(fetchNearbyOffersAction(currentOfferId));
      }
      if (!comment.length) {
        dispatch(fetchCommentsAction(currentOfferId));
      }
    }
  }, [dispatch, currentOfferId, nearbyOffers, offerById, comment]);

  if (isOfferByIdLoading) {
    return <LoadingScreen />;
  }

  if (!offerById) {
    return <NotFoundScreen />;
  }

  const handleFavoriteClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      dispatch(redirectToRoute(AppRoute.Login));
      return;
    }
    if (offerById) {
      dispatch(setFavoriteStatusAction([
        offerById.id,
        Number(!offerById.isFavorite),
      ]))
        .unwrap()
        .then(() => {
          dispatch(updateCards(offerById));
          dispatch(loadOfferById(!offerById.isFavorite));
        })
        .catch((error) => {
          processErrorHandle(String(error));
        });
    }
  };

  const currentNearbyOffers = nearbyOffers ? nearbyOffers.slice(0, NEARBY_OFFERS_COUNT) : [];
  const nearbyOffersPlusCurrent = [...currentNearbyOffers];

  if (currentOffer) {
    nearbyOffersPlusCurrent.unshift(currentOffer);
  }

  return (
    <main className="page__main page__main--offer">
      <Helmet>
        <title>Шесть городов: Предложение</title>
      </Helmet>
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {offerById.images.map((image, index) => {
              if (index < OFFER_IMGS_COUNT) {
                return (
                  <div key={image} className="offer__image-wrapper">
                    <img
                      className="offer__image"
                      src={image}
                      alt={`Photo ${offerById.type}`}
                    />
                  </div>);
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <div className="offer__container container">
          <div className="offer__wrapper">
            {offerById.isPremium ?
              <div className="offer__mark">
                <span>Premium</span>
              </div>
              : ''}
            <div className="offer__name-wrapper">
              <h1 className="offer__name">
                {offerById.title}
              </h1>
              <button
                className={`offer__bookmark-button button ${offerById.isFavorite ? 'offer__bookmark-button--active' : ''}`}
                type="button"
                onClick={handleFavoriteClick}
              >
                <svg className="offer__bookmark-icon" width={31} height={33}>
                  <use xlinkHref="#icon-bookmark"></use>
                </svg>
                <span className="visually-hidden">To bookmarks</span>
              </button>
            </div>
            <div className="offer__rating rating">
              <div className="offer__stars rating__stars">
                <span style={{width: `${getRatingPercentage(offerById.rating)}%`}}></span>
                <span className="visually-hidden">Rating</span>
              </div>
              <span className="offer__rating-value rating__value">{offerById.rating}</span>
            </div>
            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {offerById.type}
              </li>
              <li className="offer__feature offer__feature--bedrooms">
                {offerById.bedrooms} {
                  offerById.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'
                }
              </li>
              <li className="offer__feature offer__feature--adults">
                Max {offerById.maxAdults} {
                  offerById.maxAdults === 1 ? 'adult' : 'adults'
                }
              </li>
            </ul>
            <div className="offer__price">
              <b className="offer__price-value">&euro;{offerById.price}</b>
              <span className="offer__price-text">&nbsp;night</span>
            </div>
            <div className="offer__inside">
              <h2 className="offer__inside-title">What&apos;s inside</h2>
              <ul className="offer__inside-list">
                {offerById.goods.map((good) => (
                  <li key={good} className="offer__inside-item">
                    {good}
                  </li>
                ))}
              </ul>
            </div>
            <div className="offer__host">
              <h2 className="offer__host-title">Meet the host</h2>
              <div className="offer__host-user user">
                <div className={`offer__avatar-wrapper user__avatar-wrapper ${offerById.host.isPro ? 'offer__avatar-wrapper--pro' : ''}`}>
                  <img
                    className="offer__avatar user__avatar"
                    src={offerById.host.avatarUrl}
                    width={74}
                    height={74}
                    alt="Host avatar"
                  />
                </div>
                <span className="offer__user-name">
                  {offerById.host.name}
                </span>
                {
                  offerById.host.isPro ?
                    <span className="offer__user-status">Pro </span>
                    : null
                }
              </div>
              <div className="offer__description">
                <p className="offer__text">
                  {offerById.description}
                </p>
              </div>
            </div>
            <Reviews />
          </div>
        </div>
        <section className="offer__map map">
          <Map
            location={offerById.city.location}
            points={nearbyOffersPlusCurrent}
            selectedPoint={currentOffer}
          />
        </section>
      </section>
      <div className="container">
        <section className="near-places places">
          <h2 className="near-places__title">Other places in the neighbourhood</h2>
          <div className="near-places__list places__list">
            {currentNearbyOffers.map((offer) => (
              <MemorizedPlaceCard
                offer={offer}
                key={offer.id}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default OfferScreen;
