export default function trimLabel(label) {
  return label.length >= 30 ? `${label.slice(0, 27)}...` : label
}
