import IconSnow from '../assets/IconSnow.webp';
import IconCold from '../assets/IconCold.webp';
import IconFog from '../assets/IconFog.webp';
import IconRain from '../assets/IconRain.webp';
import IconPrecipitation from '../assets/IconPrecip.webp';
import IconStorm from '../assets/IconStorm.webp';
import './Legend.css';

/**
 * Legend Component
 * 
 * This functional component renders a legend for weather types, displaying
 * corresponding icons with descriptive labels. It is dynamically created from
 * a predefined list of weather conditions and their associated icons.
 * 
 * @component
 * @returns {JSX.Element} JSX markup for the legend.
 */
export default function Legend() {
  /**
   * Array of legend icons, each representing a weather type.
   */
  const legendItems = [
    { label: 'Snow', icon: IconSnow },
    { label: 'Cold', icon: IconCold },
    { label: 'Fog', icon: IconFog },
    { label: 'Rain', icon: IconRain },
    { label: 'Precipitation', icon: IconPrecipitation },
    { label: 'Storm', icon: IconStorm },
  ];

  return (
    <div className="legend">
      {legendItems.map((item) => 
        <div key={item.label} className="legend-item">
          <img src={item.icon} alt={item.label} className="legend-icon" />
          <span>{item.label}</span>
        </div>
      )}
    </div>
  );
}
