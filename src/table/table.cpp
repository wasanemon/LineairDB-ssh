#include "table/table.h"

#include <string_view>

#include "index/concurrent_table.h"
#include "lineairdb/config.h"
#include "secondary_index/secondary_index_interface.h"
#include "util/epoch_framework.hpp"

namespace LineairDB {

Table::Table(EpochFramework& epoch_framework, const Config& config,
             std::string_view table_name)
    : epoch_framework_(epoch_framework),
      config_(config),
      primary_index_(epoch_framework, config),
      table_name_(table_name) {}

const std::string& Table::GetTableName() const { return table_name_; }
Index::ConcurrentTable& Table::GetPrimaryIndex() { return primary_index_; }

}  // namespace LineairDB