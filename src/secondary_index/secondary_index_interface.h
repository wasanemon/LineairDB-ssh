#pragma once
#include <any>
#include <string_view>
#include <typeinfo>
#include <vector>

#include "types/data_item.hpp"

namespace LineairDB {
namespace Index {
class SecondaryIndexInterface {
 public:
  virtual ~SecondaryIndexInterface() = default;

  virtual const std::type_info& KeyTypeInfo() const = 0;
};
}  // namespace Index
}  // namespace LineairDB