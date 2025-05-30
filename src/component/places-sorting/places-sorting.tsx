import { memo, useRef } from 'react';
import { SortOrder } from '../../const';
import { useAppSelector } from '../../hooks';
import { getSortOrder } from '../../store/app-params/selectors';

const SORT_OPTIONS = Object.values(SortOrder);

type SortOptionsProps = {
  onSortChange: (sortType: SortOrder) => void;
};

function PlacesSorting({onSortChange}: SortOptionsProps): JSX.Element {
  const currentSort = useAppSelector(getSortOrder);
  const sortMenuRef = useRef<HTMLUListElement>(null);

  const handleToggleClick = () => {
    sortMenuRef.current?.classList.toggle('places__options--opened');
  };

  const handleSortClick = (sortType: SortOrder) => {
    onSortChange(sortType);
    sortMenuRef.current?.classList.remove('places__options--opened');
  };
  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleToggleClick}
      >
        {currentSort}
        <svg className="places__sorting-arrow" width={7} height={4}>
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className="places__options places__options--custom"
        ref={sortMenuRef}
      >
        {SORT_OPTIONS.map((option) => (
          <li
            className={`places__option ${currentSort === option ? 'places__option--active' : ''}`}
            key={option}
            tabIndex={0}
            onClick={() => handleSortClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}

const MemorizedPlacesSorting = memo(PlacesSorting);

export default MemorizedPlacesSorting;
