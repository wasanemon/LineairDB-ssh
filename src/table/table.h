#pragma once

#include <memory>
#include <shared_mutex>
#include <string>
#include <string_view>
#include <unordered_map>

#include "index/concurrent_table.h"
#include "lineairdb/config.h"
#include "secondary_index/secondary_index.h"
#include "secondary_index/secondary_index_interface.h"
#include "types/definitions.h"
#include "util/epoch_framework.hpp"

namespace LineairDB {

class Table {
 public:
  Table(EpochFramework& epoch_framework, const Config& config,
        std::string_view table_name);

  const std::string& GetTableName() const;
  Index::ConcurrentTable& GetPrimaryIndex();

  template <typename K>
  bool CreateSecondaryIndex(const std::string_view index_name);

 private:
  EpochFramework& epoch_framework_;
  const Config& config_;
  Index::ConcurrentTable primary_index_;
  std::shared_mutex secondary_index_mutex_;
  std::unordered_map<std::string,
                     std::unique_ptr<Index::SecondaryIndexInterface>>
      secondary_indexes_;
  std::string table_name_;
};

// inline template implementation
template <typename K>
bool Table::CreateSecondaryIndex(const std::string_view index_name) {
  std::unique_lock<std::shared_mutex> lk(secondary_index_mutex_);
  auto inserted = secondary_indexes_.emplace(
      std::string(index_name),
      std::make_unique<Index::SecondaryIndex<K>>(epoch_framework_, config_));
  return inserted.second;
}
}  // namespace LineairDB